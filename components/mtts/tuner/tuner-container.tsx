import React, { useRef, useEffect, useState } from 'react'
import { Note, Pitch } from 'mtts'
import { generateNotesForPitch } from '../../../utils/mtts'

interface TunerContainerProps {
  audioStream: MediaStream
}

const FFT_SIZE = 32768

const notesPerPitch = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => generateNotesForPitch(new Pitch({ value: i })))
console.log(notesPerPitch[0].map(n => n.map(nn => `${nn.SPN} : ${nn.frequency}`)))
const notes = [
  [new Note({ name: 'E', pitch: new Pitch({ value: 2 }) })],
  [new Note({ name: 'A', pitch: new Pitch({ value: 2 }) })],
  [new Note({ name: 'D', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'G', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'B', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'E', pitch: new Pitch({ value: 4 }) })]
]

function useAnalyser (stream: MediaStream): [AnalyserNode, MediaStreamAudioSourceNode] {
  const ctx = new AudioContext()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  const sourceNode = ctx.createMediaStreamSource(stream)
  sourceNode.connect(analyser)
  return [analyser, sourceNode]
}

interface GuessedNote {
  notes: Note[];
  value?: number;
  values: number[];
}

const TunerContainer = ({ audioStream }: TunerContainerProps) => {
  const canvas = useRef<HTMLCanvasElement>()
  const [guessedNotes, setGuessedNotes] = useState<GuessedNote[]>([])
  const [mostProbable, setMostProbable] = useState<GuessedNote | undefined>()
  const [frame, setFrame] = useState(-1)

  useEffect(() => {
    const [analyser, sourceNode] = useAnalyser(audioStream)
    const sampleRate = sourceNode.context.sampleRate
    const bufferLength = analyser.frequencyBinCount
    const frequencyRatio = sampleRate / FFT_SIZE
    console.log(frequencyRatio)

    function loop (ctx: CanvasRenderingContext2D) {
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'black'
      const currentNotes: GuessedNote[] = []
      let bigNote: GuessedNote = { notes: [], value: 0, values: [0, 0] }
      notes.forEach((n) => {
        const low = Math.floor(n[0].frequency / frequencyRatio)
        const high = Math.ceil(n[0].frequency / frequencyRatio)
        if (dataArray[low] > 25 || dataArray[high] > 25) {
          ctx.fillRect(low, 0, 1, dataArray[low])
          ctx.fill()
          ctx.fillRect(high, 0, 1, dataArray[high])
          ctx.fill()
          const med = (dataArray[low] + dataArray[high]) / 2
          currentNotes.push({ notes: n, values: [dataArray[low], dataArray[high]], value: med })
          if (bigNote.value < med) {
            bigNote = { notes: n, value: med, values: [dataArray[low], dataArray[high]] }
          }
        }
      })

      if (currentNotes.length > 0) {
        setGuessedNotes(currentNotes)
        setMostProbable(bigNote)
      } else {
        setGuessedNotes([])
        setMostProbable(undefined)
      }

      setFrame(requestAnimationFrame(() => loop(ctx)))
    }

    if (canvas.current) {
      const ctx = canvas.current.getContext('2d')
      canvas.current.width = bufferLength
      canvas.current.height = 255
      ctx.canvas.width = bufferLength
      ctx.canvas.height = 255
      loop(ctx)
    }

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [audioStream])

  return (
    <div className="w-screen h-screen">
      <canvas ref={canvas} />
      <p>{mostProbable !== undefined ? <span>{mostProbable.values.reduce((p, c) => c - p, 0)} {mostProbable.notes.map(n => n.SPN).join('/')}</span> : 'no guess...'}</p>
      <ul>
        {guessedNotes.map((n, i) => <li key={i}>{n.value} {n.notes.map(nn => nn.SPN).join('-')}</li>)}
      </ul>
    </div>
  )
}

export default TunerContainer
