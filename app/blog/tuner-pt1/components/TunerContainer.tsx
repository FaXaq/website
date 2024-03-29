import React, { useRef, useEffect, useState } from 'react'
import { Note, Pitch } from 'mtts'
import GuessedNoteItem from './GuessedNote'

interface TunerContainerProps {
  audioStream: MediaStream
}

export interface GuessedNote {
  notes: Note[];
  values: number[];
  diffs: number[];
}

const FFT_SIZE = 32768

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

function getNoteTotalValue (note: GuessedNote): number {
  return note.values.reduce((p, c) => p + c, 0)
}

const TunerContainer = ({ audioStream }: TunerContainerProps) => {
  const canvas = useRef<HTMLCanvasElement>()
  const [guessedNotes, setGuessedNotes] = useState<GuessedNote[]>([])
  const [mostProbable, setMostProbable] = useState<GuessedNote | undefined>()
  const [frame] = useState(-1)
  const [fqRatio, setFqRatio] = useState(-1)
  const [analyser, sourceNode] = useAnalyser(audioStream)

  useEffect(() => {
    const sampleRate = sourceNode.context.sampleRate
    const bufferLength = analyser.frequencyBinCount
    const frequencyRatio = sampleRate / FFT_SIZE
    setFqRatio(frequencyRatio)

    function loop (ctx: CanvasRenderingContext2D) {
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'black'
      const currentNotes: GuessedNote[] = []
      let bigNote: GuessedNote | undefined
      notes.forEach((n) => {
        // since frequency is most likely not gonna hit precisely a frequency bin, analyse the two closests one with diff coefficients
        // get lower index of note frequency
        const low = Math.floor(n[0].frequency / frequencyRatio)
        // get higher index of note frequency
        const high = Math.ceil(n[0].frequency / frequencyRatio)
        const lowDiff = Math.abs(n[0].frequency - (low * frequencyRatio))
        const highDiff = Math.abs(n[0].frequency - (high * frequencyRatio))
        if (dataArray[low] > 100 || dataArray[high] > 100) {
          ctx.fillRect(low, 0, 1, dataArray[low])
          ctx.fill()
          ctx.fillRect(high, 0, 1, dataArray[high])
          ctx.fill()
          const currentNote: GuessedNote = { notes: n, values: [dataArray[low], dataArray[high]], diffs: [lowDiff, highDiff] }
          currentNotes.push(currentNote)
          if (!bigNote || getNoteTotalValue(bigNote) < getNoteTotalValue(currentNote)) {
            bigNote = { notes: n, values: [dataArray[low], dataArray[high]], diffs: [lowDiff, highDiff] }
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

      setTimeout(() => loop(ctx), 1000)
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
    <div className="h-full w-full overflow-auto">
      <p className="m-0 p-0">Guessing the note :</p>
      <canvas ref={canvas} className="w-full" height="h-64" />
      <ul>
        { mostProbable !== undefined ? <GuessedNoteItem guessedNote={ mostProbable } fqRatio={fqRatio} /> : null }
        {guessedNotes.map((n, i) => (
          <li className="p-0" key={`guessed-note-${i}`}> 
            <GuessedNoteItem guessedNote={n}  fqRatio={fqRatio}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TunerContainer
