import React, { useRef, useEffect, useState } from 'react'
import { Note, Pitch } from 'mtts'
import { generateNotesForPitch } from '../../../utils/mtts'

interface TunerContainerProps {
  audioStream: MediaStream
}

const FFT_SIZE = 32768

const notesPerPitch = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => generateNotesForPitch(new Pitch({ value: i })))
console.log(notesPerPitch[0].map(n => n.map(nn => `${nn.SPN} : ${nn.frequency}`)))
const notes = notesPerPitch.reduce((p, c) => [...p, ...c], [])

function useAnalyser (stream: MediaStream): [AnalyserNode, MediaStreamAudioSourceNode] {
  const ctx = new AudioContext()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  const sourceNode = ctx.createMediaStreamSource(stream)
  const highPassFT = ctx.createBiquadFilter()
  highPassFT.type = 'highpass'
  highPassFT.frequency.setValueAtTime(notesPerPitch[0][0][0].frequency, ctx.currentTime)
  const lowPassFT = ctx.createBiquadFilter()
  lowPassFT.type = 'lowpass'
  console.log(notesPerPitch[7][notesPerPitch[7].length - 1][0].frequency)
  lowPassFT.frequency.setValueAtTime(notesPerPitch[7][notesPerPitch[7].length - 1][0].frequency, ctx.currentTime)
  sourceNode.connect(lowPassFT)
  lowPassFT.connect(highPassFT)
  highPassFT.connect(analyser)
  return [analyser, sourceNode]
}

const TunerContainer = ({ audioStream }: TunerContainerProps) => {
  const canvas = useRef<HTMLCanvasElement>()
  const [analyser, sourceNode] = useAnalyser(audioStream)
  const [guessedNotes, setGuessedNotes] = useState<Note[][]>([])

  useEffect(() => {
    const sampleRate = sourceNode.context.sampleRate
    console.log(Math.floor(new Note({ name: 'E', pitch: new Pitch({ value: 2 }) }).frequency))
    const bufferLength = analyser.frequencyBinCount
    const frequencyRatio = sampleRate / bufferLength
    console.log(frequencyRatio)

    function loop (ctx: CanvasRenderingContext2D) {
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'black'
      const currentNotes: {notes: Note[], value: number[]}[] = []
      let bigNote: { notes: Note[], value: number, values: number[]} = { notes: [], value: 0, values: [0, 0] }
      notes.forEach((n) => {
        const low = Math.floor(n[0].frequency / frequencyRatio)
        const high = Math.ceil(n[0].frequency / frequencyRatio)
        if (dataArray[low] > 50 || dataArray[high] > 50) {
          ctx.fillRect(low, 0, 1, dataArray[low])
          ctx.fill()
          ctx.fillRect(high, 0, 1, dataArray[high])
          ctx.fill()
          const med = (dataArray[low] + dataArray[high]) / 2
          currentNotes.push({ notes: n, value: [dataArray[low], dataArray[high]] })
          if (bigNote.value < med) {
            bigNote = { notes: n, value: med, values: [dataArray[low], dataArray[high]] }
          }
        }
      })

      if (currentNotes.length > 0) {
        console.log(bigNote.notes.map(n => n.SPN).join(','), bigNote.value, bigNote.values)
        console.log(currentNotes)
      }

      // dataArray.forEach((v, i) => {
      //   ctx.fillRect(i, 0, 1, v)
      //   ctx.fill()
      // })

      setTimeout(() => loop(ctx), 300)
    }

    if (canvas.current) {
      const ctx = canvas.current.getContext('2d')
      canvas.current.width = bufferLength
      canvas.current.height = 255
      ctx.canvas.width = bufferLength
      ctx.canvas.height = 255
      loop(ctx)
    }
  }, [audioStream])

  return (
    <div className="w-screen h-screen">
      <canvas ref={canvas} />
      <p>{guessedNotes.map(n => n.map(nn => nn.SPN).join('/')).join(' OR ')}</p>
    </div>
  )
}

export default TunerContainer
