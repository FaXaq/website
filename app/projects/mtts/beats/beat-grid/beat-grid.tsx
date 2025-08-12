import React, { useState, useEffect } from 'react'
import BeatLine from './beat-line'
// eslint-disable-next-line no-unused-vars
import { Score } from 'mtts'

interface BeatGridProps {
  lineNumber?: number
}

const BeatGrid = ({ lineNumber = 4 } : BeatGridProps) => {
  const [scores, setScores] = useState<Score[]>([])

  useEffect(() => {
    const s = Object.assign([], scores)
    if (s.length < lineNumber) {
      for (let i = s.length; i < lineNumber; i++) {
        s.push(new Score())
      }
    }
    setScores(s)
  }, [lineNumber])

  const lines = scores.map((s, i) => (
    <li  key={i}>
      <BeatLine score={s} />
    </li>
  ))
  return (
    <ul >
      {lines}
    </ul>
  )
}

export default BeatGrid
