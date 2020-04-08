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
      <li key={`beat-bar-${i}`} className="border flex-grow bg-blue-100 h-1/2" style={{ width: `${(c.dottedValue * 100)}%` }}>
        { JSON.stringify(c) }
      </li>
    )
  })

  return (
    <div className="relative h-full w-full">
      <BeatBarOverlay timeSignature={ bar.timeSignature } />
      <ul className="absolute h-full w-full flex">
        { content }
      </ul>
    </div>
  )
}

export default BeatBar
