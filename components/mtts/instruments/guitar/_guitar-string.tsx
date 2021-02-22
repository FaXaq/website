import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
// eslint-disable-next-line no-unused-vars
import { HighlightFunction } from './guitar-neck'
// eslint-disable-next-line no-unused-vars
import GuitarFret, { GuitarFretProps } from './_guitar-fret'

export interface GuitarStringProps {
  tuning: Note[],
  stringNumber: number,
  fretNumber?: number,
  highlight: HighlightFunction
}

function GuitarString ({ tuning, fretNumber, highlight, stringNumber }: GuitarStringProps) {
  const frets: GuitarFretProps[] = [{
    notes: tuning.map(n => n.duplicate()),
    stringNumber,
    fretNumber: 0,
    highlight
  }]

  for (let i = 0; i < fretNumber; i++) {
    frets.push({
      notes: tuning.map(note => note.sharpenChromatically().duplicate()),
      highlight,
      stringNumber,
      fretNumber: i
    })
  }

  return <ul className="flex flex-row">
    { frets.map((fret, i) => <GuitarFret key={`string-${stringNumber}-fret-${i}`} {...fret} />)}
  </ul>
}

export default GuitarString
