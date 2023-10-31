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

  const notesItems = notes.map(n => {
    return <li
      className="text-white text-lg opacity-75"
      key={`tile-note-${n.name}-${n.pitch.value}`}>
      {t(`mtts.notes.${n.name}`)}
      {n.hasAccidental() && n.accidental.semitones !== 0
        ? t(`mtts.accidentals.${n.accidental.name}`)
        : ''}
      <span> {n.pitch.value}</span>
    </li>
  })

  const joinedNames = notes.map(n => n.name).join('-').toLowerCase()

  return (
    <div className="px-2">
      <ul className={classNames({
        'flex flex-col justify-center text-center flex-1 text-xs hexagon font-black': true,
        'opacity-50': !playing,
        [`bg-mtts-${joinedNames} border-mtts-${joinedNames}`]: true
      })}>
        {notesItems}
      </ul>
    </div>
  )
}

export default React.memo(Tile)
