import React, { useState } from 'react'
import { Synth } from 'tone'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import { useTranslation } from 'react-i18next'

interface TileProps {
    notes: Note[];
}

const Tile = ({ notes }: TileProps) => {
  const [playing, setPlaying] = useState(false)
  const { t } = useTranslation()

  function playNote (note: Note) {
    const t = new Synth().toMaster()
    t.triggerAttackRelease(note.frequency, 1)
    setPlaying(true)
    setTimeout(() => setPlaying(false), 1000)
  }

  const notesItems: JSX.Element[] = notes.map(n =>
    <li key={`tile-note-${n.name}-${n.pitch.value}`}>
      {t(`mtts.notes.${n.name}`)}
      {n.hasAccidental() && n.accidental.semitones !== 0
        ? t(`mtts.accidentals.${n.accidental.name}`)
        : ''}
      <span> {n.pitch.value}</span>
    </li>
  )

  const classes = ['flex-grow', 'border', 'flex', 'justify-center', 'align-center']

  if (playing) {
    classes.push('bg-black text-white')
  }

  return (
    <div className={classes.join(' ')} onClick={() => playNote(notes[0])}>
      <ul className="flex flex-col justify-center">
        {notesItems}
      </ul>
    </div>
  )
}

export default Tile
