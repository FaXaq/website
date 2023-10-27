'use client'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Score, Rest, Note, NOTE_VALUES } from 'mtts'
import BeatBar from './beat-bar'

interface BeatLineProps {
  score: Score;
}

const BeatLine = ({ score }: BeatLineProps) => {
  score.addBar({
    content: [new Rest({ value: NOTE_VALUES.SIXTEENTH, dots: 1 }), new Note({ name: 'A', value: NOTE_VALUES.EIGHT })]
  })
  const bars = score.bars.map((b, i) => {
    return (
      <BeatBar bar={b} key={`bar-${i}`}/>
    )
  })
  return (
    <div className="h-full w-full">
      { bars }
    </div>
  )
}

export default BeatLine
