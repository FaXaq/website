import React, { useEffect, useMemo, useState } from 'react'
import { Note } from 'mtts'
import { useAnalyser } from '../hooks/useAnalyser';
import { autoCorrelate } from '../helpers/autoCorrelate';

interface TunerContainerProps {
  audioStream: MediaStream
}

export interface GuessedNote {
  notes: Note[];
  values: number[];
  diffs: number[];
}

export interface FrequencyData {
  value: number,
  label: number
}

// Average guitar strings fluctuate to 0.3Hz
const AVERAGE_FLUCTUATION = 0.3

const notes = [
  Note.fromSPN('E2'),
  Note.fromSPN('A2'),
  Note.fromSPN('D3'),
  Note.fromSPN('G3'),
  Note.fromSPN('B3'),
  Note.fromSPN('E4'),
]

function findClosestNote(searchedFrequency: number, notesInRange: Note[]): Note {
  if (notesInRange.length <= 3) {
    let noteFound = notesInRange[0]
    let closest = Math.abs(searchedFrequency - noteFound.frequency)
    for (let i = 1; i < notesInRange.length; i++) {
      const frequencyDifference = Math.abs(searchedFrequency - notesInRange[i].frequency)
      if (closest > frequencyDifference) {
        noteFound = notesInRange[i]
        closest = frequencyDifference
      }
    }
    return noteFound
  }

  const secondHalf = notesInRange.slice(notesInRange.length / 2, notesInRange.length)

  if (searchedFrequency < secondHalf[0].frequency) {
    return findClosestNote(searchedFrequency, notesInRange.slice(0, (notesInRange.length / 2) + 1))
  }

  return  findClosestNote(searchedFrequency, notesInRange.slice((notesInRange.length / 2) - 1, notesInRange.length))
}

const TunerContainer = ({ audioStream }: TunerContainerProps) => {
  const [guessing, setGuessing] = useState<boolean>(false)
  const [guessingInterval, setGuessingInterval] = useState<number>()
  const [guessedFrequency, setGuessedFrequency] = useState(-1)
  const [guessedNote, setGuessedNote] = useState<Note>()
  const [analyser] = useAnalyser(audioStream, 2048)

  function stop() {
    setGuessing(false)
    clearInterval(guessingInterval)
  }

  function start() {
    if (analyser) {
      setGuessing(true)
      const interval = setInterval(() => {
        const buffer = new Float32Array(analyser.fftSize)
        analyser.getFloatTimeDomainData(buffer)
        setGuessedFrequency(autoCorrelate(buffer, analyser.context.sampleRate))
      }, 500) as unknown as number
      setGuessingInterval(interval)
    }
  }

  useEffect(() => {
    if (guessedFrequency > 0) {
      setGuessedNote(findClosestNote(guessedFrequency, notes))
    } else {
      setGuessedNote(undefined)
    }

    return undefined
  }, [setGuessedNote, guessedFrequency])

  const inTune = Math.abs(guessedFrequency - guessedNote?.frequency) < AVERAGE_FLUCTUATION
  const sharp = Math.abs(guessedFrequency - guessedNote?.frequency) > AVERAGE_FLUCTUATION && (guessedFrequency - guessedNote?.frequency) > 0
  const flat = Math.abs(guessedFrequency - guessedNote?.frequency) > AVERAGE_FLUCTUATION && (guessedFrequency - guessedNote?.frequency) < 0

  return (
    <div className="h-full w-full overflow-auto">
      <p className="m-0 p-0">Guessing the note : { guessedNote ?
        <span>{guessedNote.SPN} {inTune && 'in tune !' }{ flat && 'flat' }{ sharp && 'sharp' }</span> : <span>Not hearing much ...</span>}</p>
      { guessing ? <button onClick={() => stop()}>stop</button> : <button onClick={() => start()}>start</button> }
    </div>
  )
}

export default TunerContainer
