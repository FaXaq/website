'use client'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'

interface TileProps {
    notes: Note[];
    playing: boolean
}

const Tile = ({ notes, playing }: TileProps) => {
  const { t } = useTranslation()

  const formatNoteString = (note: Note) => {
    return '' + t(`mtts.notes.${note.name}`) +
        (note.hasAccidental() && note.accidental.semitones !== 0
          ? t(`mtts.accidentals.${note.accidental.name}`)
          : '' + note.pitch.value)
  }
  

  const notesItems = notes.map(n => {
    return <li
      className="h-full flex flex-col justify-center text-white bg-white text-lg"
      key={`tile-note-${n.name}-${n.pitch.value}`}>
      <span className="text-mtts-dark-violet">
        {formatNoteString(n)}
      </span>
    </li>
  })

  const joinedNames = notes.map(n => n.name).join('-').toLowerCase()

  return (
    <div className="px-2">
      <ul className={classNames({
        'flex flex-col justify-center text-center flex-1 text-xs hexagon font-black': true,
        'opacity-50': !playing,
      })}>
        {notesItems}
      </ul>
    </div>
  )
}

export default React.memo(Tile)
