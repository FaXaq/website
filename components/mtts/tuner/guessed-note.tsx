import React from 'react'
// eslint-disable-next-line no-unused-vars
import { GuessedNote } from './tuner-container'

interface GuessedNoteProps {
  guessedNote: GuessedNote
}

function calculateNoteRatio (note: GuessedNote) {
  const diff = note.diffs.reduce((p, c) => c - p, 0)
  return diff
}

const GuessedNoteItem = ({ guessedNote }: GuessedNoteProps) => {
  const spn = guessedNote.notes.map(n => n.SPN).join('/')
  const value = guessedNote.values.reduce((p, c) => c - p, 0)
  const coeffsS = guessedNote.diffs.map(c => Math.floor(c * 100) / 100).join('-')
  const values = guessedNote.values.join('-')
  const ratio = calculateNoteRatio(guessedNote)

  return (
    <li>{value} {coeffsS} {spn} {values} {ratio}</li>
  )
}

export default GuessedNoteItem
