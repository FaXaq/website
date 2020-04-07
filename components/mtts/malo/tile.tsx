import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import { useTranslation } from 'react-i18next'

interface TileProps {
    notes: Note[];
    playNotes: (notes: Note[]) => void;
    playing: boolean
}

const Tile = ({ notes, playing, playNotes }: TileProps) => {
  const { t } = useTranslation()

  const notesItems: JSX.Element[] = notes.map(n => {
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

  const classes = ['flex', 'flex-col', 'justify-center', 'text-center', 'flex-1', 'text-xs', 'hexagon', 'font-black']

  if (!playing) {
    classes.push('opacity-50')
  }

  const joinedNames = notes.map(n => n.name).join('-').toLowerCase()
  classes.push(
    `bg-mtts-${joinedNames}`,
    `border-mtts-${joinedNames}`
  )

  return (
    <div className="px-2" onClick={() => playNotes(notes)}>
      <ul className={classes.join(' ')}>
        {notesItems}
      </ul>
    </div>
  )
}

export default Tile
