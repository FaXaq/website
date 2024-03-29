'use client'

import React, { useState, useMemo } from 'react'

// eslint-disable-next-line no-unused-vars
import { Note, Pitch } from 'mtts'
import { generateNotesForPitch } from '../../../../utils/mtts'
import TileContainer from './components/tile-container'
import './malo.scss'

const Malo = () => {
  const [lineLength] = useState(20)
  const [lineNumber] = useState(10)

  const notes = useMemo(() => {
    const n: Note[][] = []
    for (let i = 1; i < lineNumber + 1; i++) {
      n.push(...generateNotesForPitch(new Pitch({ value: i })))
    }

    return n
  }, [lineNumber])

  return <div className="overflow-hidden bg-mtts-dark-violet">
    <TileContainer lineLength={lineLength} lineNumber={lineNumber} notes={notes} />
  </div>
}

export default Malo
