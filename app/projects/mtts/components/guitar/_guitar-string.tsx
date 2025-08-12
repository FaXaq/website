'use client'

import React from 'react'
import { Note } from 'mtts'
import GuitarFret, { FGetFret, GuitarFretProps, FHighlight } from './_guitar-fret'
import { FRET_MARKER } from './const'
import classNames from 'classnames'
import { useGuitarNeck } from './context'

export interface GuitarStringProps {
  tuning: string,
  stringNumber: number,
  fretNumber?: number,
  highlightFret: FHighlight,
  getFret: FGetFret,
}

function GuitarString ({ tuning, fretNumber, highlightFret, getFret, stringNumber }: GuitarStringProps) {
  const { layout } = useGuitarNeck()

  const frets: GuitarFretProps[] = [{
    note: tuning === FRET_MARKER ? FRET_MARKER : Note.fromSPN(tuning),
    stringNumber,
    fretNumber: 0,
    highlight: highlightFret,
    getFret: getFret
  }]

  for (let i = 1; i < fretNumber; i++) {
    frets.push({
      note: tuning === FRET_MARKER ? FRET_MARKER : Note.fromSPN(tuning).sharpenChromatically(i),
      highlight: highlightFret,
      getFret: getFret,
      stringNumber,
      fretNumber: i
    })
  }

  return <ul>
    { frets.map((fret, i) => <GuitarFret key={`string-${stringNumber}-fret-${i}`} {...fret} />)}
  </ul>
}

export default GuitarString
