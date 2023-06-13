import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import GuitarFret, { FGetFret, GuitarFretProps, FHighlight } from './_guitar-fret'

export interface GuitarStringProps {
  tuning: string,
  stringNumber: number,
  fretNumber?: number,
  highlightFret: FHighlight,
  getFret: FGetFret
}

function GuitarString ({ tuning, fretNumber, highlightFret, getFret, stringNumber }: GuitarStringProps) {
  const frets: GuitarFretProps[] = [{
    note: Note.fromSPN(tuning),
    stringNumber,
    fretNumber: 0,
    highlight: highlightFret,
    getFret: getFret
  }]

  for (let i = 1; i < fretNumber; i++) {
    frets.push({
      note: Note.fromSPN(tuning).sharpenChromatically(i),
      highlight: highlightFret,
      getFret: getFret,
      stringNumber,
      fretNumber: i
    })
  }

  return <ul className="flex flex-row">
    { frets.map((fret, i) => <GuitarFret key={`string-${stringNumber}-fret-${i}`} {...fret} />)}
  </ul>
}

export default GuitarString
