'use client'

import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Note, Scale } from 'mtts'
import { COLOR, getNoteColor } from '../helpers/getNoteColor'
import { getNoteInScale } from '../helpers/getNoteInScale'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import { useGuitarNeck } from '../../components/guitar/context'
import { useNoteTranslation } from '../hooks/useNoteTranslation'
import { NOTE_DISPLAY, useScaleBuilderSettings } from '../context/settings'
import { getNoteIntervalIndexInScale } from '../helpers/getNoteIntervalIndexInScale'

interface IFretProps {
  note: Note | string,
  stringNumber: number,
  fretNumber: number,
  highlighted: boolean,
  scale: Scale
}

function Fret({ note, highlighted, scale, fretNumber }: IFretProps) {
  const [active, setActive] = useState(false)
  const { translateNote } = useNoteTranslation()
  const { noteDisplay } = useScaleBuilderSettings()

  function toggleFret() {
    setActive(!active)
  }

  if (!(note instanceof Note)) {
    return <div>
      <p>
        {(fretNumber === 12 || fretNumber === 24) && '••'}
        {(fretNumber === 3 || fretNumber === 5 || fretNumber === 7 || fretNumber === 9) && '•'}
        {(fretNumber === 15 || fretNumber === 17 || fretNumber === 19 || fretNumber === 21) && '•'}
      </p>
    </div>
  }

  function getNoteText(scale: Scale, note: Note): string {
    if (!noteExistsInScale(scale, note)) {
      return ''
    }

    let str = ''
  
    if (noteDisplay === NOTE_DISPLAY.NOTE_NAME || noteDisplay === NOTE_DISPLAY.BOTH) {
      str += translateNote(getNoteInScale(scale, note))
    }

    if (noteDisplay === NOTE_DISPLAY.NOTE_NAME) {
      return str
    } else if (noteDisplay === NOTE_DISPLAY.BOTH) {
      str += ' / '
    }

    if (noteDisplay === NOTE_DISPLAY.SCALE_DEGREE || noteDisplay === NOTE_DISPLAY.BOTH) {
      const index = getNoteIntervalIndexInScale(scale, note)
      if (index < 0) {
        return ''
      }
      str += scale.intervals[index].name
    }

    return str
  }

  return (
    <div onClick={() => toggleFret()}>
      <div>
        <div>
          {noteExistsInScale(scale, note)
            ? (<p>{getNoteText(scale, note)}</p>)
            : (<p></p>) }
        </div>
      </div>
    </div>
  )
}

export default Fret
