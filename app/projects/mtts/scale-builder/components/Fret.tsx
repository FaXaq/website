'use client'

import React, { useState } from 'react'
import classNames from 'classnames'
import { Note } from 'mtts'

interface IFretProps {
  note: Note | string,
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

function Fret({ note, highlighted, noteExistsInScale, getNoteInScale, getNoteIntervalIndexInScale, fretNumber }: IFretProps) {
  const [active, setActive] = useState(false)

  function toggleFret() {
    setActive(!active)
  }

  if (!(note instanceof Note)) {
    return <div className="m-1 h-4 w-10 border-left-1 rounded">
      <p className='text-lg text-center leading-3'>
        {(fretNumber === 12 || fretNumber === 24) && '••'}
        {(fretNumber === 3 || fretNumber === 5 || fretNumber === 7 || fretNumber === 9) && '•'}
        {(fretNumber === 15 || fretNumber === 17 || fretNumber === 19 || fretNumber === 21) && '•'}
      </p>
    </div>
  }

  const classes = classNames({
    'text-white': true,
    'bg-mtts-cta-0': highlighted && getNoteIntervalIndexInScale(note) === 1,
    'bg-mtts-yellow': highlighted && getNoteIntervalIndexInScale(note) === 2,
    'bg-mtts-khaki': highlighted && getNoteIntervalIndexInScale(note) === 3,
    'bg-mtts-green': highlighted && getNoteIntervalIndexInScale(note) === 4,
    'bg-mtts-blue': highlighted && getNoteIntervalIndexInScale(note) === 5,
    'bg-mtts-violet': highlighted && getNoteIntervalIndexInScale(note) === 6,
    'bg-mtts-red': highlighted && getNoteIntervalIndexInScale(note) === 7,
    'p-1 w-10 flex align-items border-left-1 rounded': true
  })

  return (
    <div className={classNames({
      'w-full h-full p-1': true,
      'bg-mtts-dark-violet': active
    })}
    onClick={() => toggleFret()}
    >
      <div
        className={classes}
      >
        <div className="m-auto">
          {noteExistsInScale(note) ? <p>{getNoteNameWithoutPitch(getNoteInScale(note))}</p> : <p></p>}
        </div>
      </div>
    </div>
  )
}

export default Fret
