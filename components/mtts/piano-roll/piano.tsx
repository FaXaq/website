import React, { useState } from 'react'
import { generateNotesForPitch } from '../../../utils/mtts'
import { Note, Pitch } from 'mtts'
import PianoNote from './piano-note'
import classNames from 'classnames'
import { usePolySynth } from '../../../hooks/mtts/polysynth'

interface PianoProps {
  align?: 'top' | 'right' | 'bottom' | 'left'
}

const Piano = ({
  align = 'left'
}: PianoProps) => {
  const [lowNote] = useState<Note>(Note.fromSPN('A0'))
  const [highNote] = useState<Note>(Note.fromSPN('C8'))
  const pianoNotes: JSX.Element[] = []
  const { isPlaying, stopPlaying, startPlaying } = usePolySynth()

  for (let i = highNote.pitch.value; i > lowNote.pitch.value + 1; i--) {
    let notes = generateNotesForPitch(new Pitch({ value: i }))

    // filter notes below low note
    if (i === lowNote.pitch.value) {
      notes = notes.filter(n => n[0].getSemitonesTo(lowNote) <= 0)
    }

    if (i === highNote.pitch.value) {
      notes = notes.filter(n => n[0].getSemitonesTo(highNote) >= 0)
    }

    pianoNotes.push(
      ...notes.reverse().map(n =>
        <PianoNote
          key={n.map(n => n.SPN).join('-')}
          notes={n}
          isPreviousToBlackKey={n.reduce((previousValue, currentValue) => {
            return previousValue || !currentValue.isCorF()
          }, false)}
          align={align}
          playing={isPlaying(n)}
          startPlaying={startPlaying}
          stopPlaying={stopPlaying}
        />
      )
    )
  }

  return (
    <div>
      <ul className={classNames({
        flex: true,
        'flex-row': align === 'top' || align === 'bottom',
        'flex-col': align === 'left' || align === 'right'
      })}>
        {pianoNotes}
      </ul>
    </div>
  )
}

export default Piano
