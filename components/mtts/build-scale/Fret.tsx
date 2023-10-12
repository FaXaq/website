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
  isNoteScaleRoot: (note: Note) => boolean
}

function getNoteNameWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/g, '')
}

function Fret({ note, highlighted, noteExistsInScale, getNoteInScale, isNoteScaleRoot }: IFretProps) {
  const classes = classNames({
    'bg-mtts-cta-0 text-white': isNoteScaleRoot(note),
    'bg-mtts-cta-2': highlighted && !isNoteScaleRoot(note),
    'color-white rounded': highlighted,
    'p-1 m-1 w-10 flex align-items border-left-1': true
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
