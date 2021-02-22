import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note, Pitch } from 'mtts'
// eslint-disable-next-line no-unused-vars
import GuitarString, { GuitarStringProps } from './_guitar-string'

const DEFAULT_GUITAR_TUNING = [
  [new Note({ name: 'E', pitch: new Pitch({ value: 2 }) })],
  [new Note({ name: 'A', pitch: new Pitch({ value: 2 }) })],
  [new Note({ name: 'D', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'G', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'B', pitch: new Pitch({ value: 3 }) })],
  [new Note({ name: 'E', pitch: new Pitch({ value: 4 }) })]
]
const DEFAULT_FRET_NUMBERS = 24

export type HighlightFunction = (notes: Note[], stringNumber: number, fretNumber: number) => boolean

export interface GuitarNeckProps {
  highlight?: HighlightFunction,
  tuning?: Note[][],
  fretNumber?: number
}

interface GuitarString {
  notes: Note[][]
}

function GuitarNeck ({
  highlight = () => false,
  tuning = DEFAULT_GUITAR_TUNING,
  fretNumber = DEFAULT_FRET_NUMBERS
}: GuitarNeckProps) {
  const strings: GuitarStringProps[] = tuning.map((t, i) => ({
    tuning: t,
    highlight,
    fretNumber,
    stringNumber: i
  }))

  return <div>
    <ul className="flex flex-col">
      { strings.map(string => <GuitarString key={`string-${string.stringNumber}`} {...string} />)}
    </ul>
  </div>
}

export default GuitarNeck
