import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames'

export type FHighlight = ({ note, stringNumber, fretNumber }: { note: Note, stringNumber?: number, fretNumber?: number }) => boolean
export type FGetFret = ({ note, stringNumber, fretNumber, highlighted }: { note: Note, highlighted: boolean, stringNumber: number, fretNumber: number }) => React.JSX.Element | null | string

export interface GuitarFretProps {
  stringNumber: number,
  fretNumber: number,
  note: Note,
  highlight: FHighlight,
  getFret: FGetFret
}

function GuitarFret ({ note, stringNumber, fretNumber, highlight, getFret }: GuitarFretProps) {
  const highlighted = highlight({ note, stringNumber, fretNumber })
  return <div className={classNames({ 'border border-collapse': fretNumber !== 0 })}>
    {getFret({ note, stringNumber, fretNumber, highlighted })}
  </div>
}

export default GuitarFret
