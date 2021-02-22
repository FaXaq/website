import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
// eslint-disable-next-line no-unused-vars
import { HighlightFunction } from './guitar-neck'
import classNames from 'classnames'

export interface GuitarFretProps {
  stringNumber: number,
  fretNumber: number,
  notes: Note[],
  highlight: HighlightFunction
}

function GuitarFret ({ notes, highlight, stringNumber, fretNumber }: GuitarFretProps) {
  return <div
    className={classNames({
      active: highlight(notes, stringNumber, fretNumber),
      'p-2': true
    })}
  >
    { notes.map(n => n.SPN).join(' / ') }
  </div>
}

export default GuitarFret
