import React from 'react'
import classNames from 'classnames'
import { Note } from 'mtts'

interface IFretProps {
  note: Note,
  stringNumber: number,
  fretNumber: number,
  highlighted: boolean,
  getNoteInScale: (note: Note) => Note,
  noteExistsInScale: (note: Note) => boolean
  getNoteIntervalIndexInScale: (note: Note) => number
}

function getNoteNameWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/g, '')
}

function Fret({ note, highlighted, noteExistsInScale, getNoteInScale, getNoteIntervalIndexInScale }: IFretProps) {
  const classes = classNames({
    'text-white': true,
    'bg-mtts-cta-0': highlighted && getNoteIntervalIndexInScale(note) === 1,
    'bg-mtts-yellow': highlighted && getNoteIntervalIndexInScale(note) === 2,
    'bg-mtts-khaki': highlighted && getNoteIntervalIndexInScale(note) === 3,
    'bg-mtts-green': highlighted && getNoteIntervalIndexInScale(note) === 4,
    'bg-mtts-blue': highlighted && getNoteIntervalIndexInScale(note) === 5,
    'bg-mtts-violet': highlighted && getNoteIntervalIndexInScale(note) === 6,
    'bg-mtts-red': highlighted && getNoteIntervalIndexInScale(note) === 7,
    'p-1 m-1 w-10 flex align-items border-left-1 rounded': true
  })

  return (
    <div
      className={classes}
    >
      <div className="m-auto">
        {noteExistsInScale(note) ? <p>{getNoteNameWithoutPitch(getNoteInScale(note))}</p> : <p></p>}
      </div>
    </div>
  )
}

export default Fret
