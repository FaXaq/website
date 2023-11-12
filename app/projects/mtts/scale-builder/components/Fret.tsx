'use client'

import React, { useState } from 'react'
import classNames from 'classnames'
import { Note, Scale } from 'mtts'
import { COLOR, getNoteColor } from '../helpers/getNoteColor'
import { getNoteInScale } from '../helpers/getNoteInScale'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import { useGuitarNeck } from '../../components/guitar/context'

interface IFretProps {
  note: Note | string,
  stringNumber: number,
  fretNumber: number,
  highlighted: boolean,
  scale: Scale
}

function getNoteNameWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/g, '')
}

function Fret({ note, highlighted, scale, fretNumber }: IFretProps) {
  const [active, setActive] = useState(false)
  const { layout } = useGuitarNeck()

  function toggleFret() {
    setActive(!active)
  }

  if (!(note instanceof Note)) {
    return <div className={classNames({
      'm-1 rounded': true,
    })}>
      <p className='text-lg text-center leading-3'>
        {(fretNumber === 12 || fretNumber === 24) && '••'}
        {(fretNumber === 3 || fretNumber === 5 || fretNumber === 7 || fretNumber === 9) && '•'}
        {(fretNumber === 15 || fretNumber === 17 || fretNumber === 19 || fretNumber === 21) && '•'}
      </p>
    </div>
  }

  const classes = classNames({
    'text-white text-xs': true,
    'bg-mtts-cta-0': highlighted && getNoteColor(scale, note) === COLOR.DEFAULT,
    'bg-mtts-yellow': highlighted && getNoteColor(scale, note) === COLOR.YELLOW,
    'bg-mtts-khaki': highlighted && getNoteColor(scale, note) === COLOR.KHAKI,
    'bg-mtts-green': highlighted && getNoteColor(scale, note) === COLOR.GREEN,
    'bg-mtts-blue': highlighted && getNoteColor(scale, note) === COLOR.BLUE,
    'bg-mtts-violet': highlighted && getNoteColor(scale, note) === COLOR.VIOLET,
    'bg-mtts-red': highlighted && getNoteColor(scale, note) === COLOR.RED,
    'p-1 flex align-items rounded': true,
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
          {noteExistsInScale(scale, note) ? <p>{getNoteNameWithoutPitch(getNoteInScale(scale, note))}</p> : <p></p>}
        </div>
      </div>
    </div>
  )
}

export default Fret
