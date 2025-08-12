'use client'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Bar } from 'mtts'
import BeatBarOverlay from './beat-bar-overlay'

interface BeatBarProps {
  bar: Bar
}

const BeatBar = ({ bar }: BeatBarProps) => {
  const content = bar.content.map((c, i) => {
    return (
      <li key={`beat-bar-${i}`}  style={{ width: `${(c.dottedValue * 100)}%` }}>
        { JSON.stringify(c) }
      </li>
    )
  })

  return (
    <div >
      <BeatBarOverlay timeSignature={ bar.timeSignature } />
      <ul >
        { content }
      </ul>
    </div>
  )
}

export default BeatBar
