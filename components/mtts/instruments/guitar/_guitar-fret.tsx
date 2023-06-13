import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames'

export type FHighlight = ({ note, stringNumber, fretNumber }: { note: Note, stringNumber?: number, fretNumber?: number }) => boolean
export type FGetFret = ({ note, stringNumber, fretNumber, highlighted }: { note?: Note, highlighted?: boolean, stringNumber?: number, fretNumber?: number }) => React.JSX.Element | null | string

export interface GuitarFretProps {
  stringNumber: number,
  fretNumber: number,
  note: Note,
  highlight: FHighlight,
  getFret: FGetFret
}

function GuitarFret ({ note, stringNumber, fretNumber, highlight, getFret }: GuitarFretProps) {
  const highlighted = highlight({ note, stringNumber, fretNumber })
  return <div className='border border-collapse'>
    <div
      className={classNames({
        'bg-mtts-dark-violet color-white rounded text-white': highlight({ note, stringNumber, fretNumber }),
        'p-2 m-2 w-10 flex align-items border-left-1': true
      })}
    >
      <div className="m-auto">
        {getFret({ note, stringNumber, fretNumber, highlighted })}
      </div>
    </div>
  </div>
}

export default GuitarFret
