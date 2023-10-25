'use client'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { GuessedNote } from './tuner-container'

interface GuessedNoteProps {
  guessedNote: GuessedNote;
  fqRatio: number;
}

function getEquation (note: GuessedNote): {multiplier: number, additioner: number} {
  const fq = note.notes[0].frequency
  const fqInf = fq - note.diffs[0]
  const fqSup = fq + note.diffs[1]
  const ampInf = note.values[0]
  const ampSup = note.values[1]

  return {
    multiplier: (ampInf - ampSup) / (fqInf - fqSup),
    additioner: (ampInf - (fqInf * (ampInf - ampSup) / (fqInf - fqSup)))
  }
}

const GuessedNoteItem = ({ guessedNote, fqRatio }: GuessedNoteProps) => {
  const spn = guessedNote.notes.map(n => n.SPN).join('/')
  const c1 = (guessedNote.diffs[0] / fqRatio) * 100
  const c2 = (guessedNote.diffs[1] / fqRatio) * 100
  const { multiplier } = getEquation(guessedNote)

  return (
    <li>
      <p> SPN : {spn}</p>
      <p> Amplitude diff : {guessedNote.values[0] - guessedNote.values[1]}</p>
      <p> Coeff diff : {c1 - c2}</p>
      <p>note frequency : {guessedNote.notes[0].frequency}</p>
      <p> Line equation multiplier : {multiplier}</p>
      <p>---------------------------</p>
    </li>
  )
}

export default GuessedNoteItem
