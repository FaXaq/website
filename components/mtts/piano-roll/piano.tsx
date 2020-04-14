import React, { useState, useMemo } from 'react'
import { generateNotesForPitch, generatePitches } from '../../../utils/mtts'
// eslint-disable-next-line no-unused-vars
import { Note, Pitch } from 'mtts'
import PianoNote from './piano-key'
import classNames from 'classnames'
import { usePolySynth } from '../../../hooks/mtts/polysynth'

interface PianoProps {
  lowNote?: Note
  highNote?: Note;
  align?: 'top' | 'right' | 'bottom' | 'left'
}

const Piano = ({
  align = 'left',
  lowNote = Note.fromSPN('A0'),
  highNote = Note.fromSPN('C8')
}: PianoProps) => {
  const { isPlaying, stopPlaying, startPlaying } = usePolySynth()
  const [pitches] = useState<Pitch[]>(generatePitches(highNote.pitch.value, lowNote.pitch.value))

  function handleClick (notes: Note[]) {
    if (!isPlaying(notes)) {
      startPlaying(notes)
    } else {
      stopPlaying(notes)
    }
  }

  const notesToDisplay = useMemo(() => {
    return pitches.map((p) => {
      let notes = generateNotesForPitch(p)

      // filter notes below low note
      if (p.value === lowNote.pitch.value) {
        notes = notes.filter(n => n[0].getSemitonesTo(lowNote) <= 0)
      }

      // filter notes above high note
      if (p.value === highNote.pitch.value) {
        notes = notes.filter(n => n[0].getSemitonesTo(highNote) >= 0)
      }

      return notes.reverse()
    }).reduce((p: Note[][], c: Note[][]) => [...p, ...c], [])
  }, [pitches])

  const pianoNotes: JSX.Element[] = notesToDisplay.map(n => {
    const isPreviousToBlackKey = n.reduce((previousValue, currentValue) => {
      return previousValue || !currentValue.isCorF()
    }, false)
    const hasAccidental = n.reduce((previousValue, currentValue) => {
      return previousValue || currentValue.hasAccidental()
    }, false)
    return (
      <li
        onClick={() => { handleClick(n) }}
        key={`piano-note-${n.map(n => n.SPN).join('-')}`}
        className={classNames({
          flex: true,
          'justify-end': align === 'right' || align === 'bottom',
          '-mb-2': (isPreviousToBlackKey || hasAccidental) && (align === 'right' || align === 'left'),
          '-ml-2': (isPreviousToBlackKey || hasAccidental) && (align === 'top' || align === 'bottom')
        })}
      >
        <PianoNote
          notes={n}
          align={align}
          playing={isPlaying(n)}
          hasAccidental={hasAccidental}
        />
      </li>
    )
  })

  return (
    <ul className={classNames({
      'flex justify-center': true,
      'flex-row-reverse h-24': align === 'top' || align === 'bottom',
      'flex-col w-24': align === 'left' || align === 'right'
    })}>
      {pianoNotes}
    </ul>
  )
}

export default Piano
