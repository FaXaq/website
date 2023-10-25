'use client'

import React from 'react'
// eslint-disable-next-line no-unused-vars
import { TimeSignature } from 'mtts'

interface BeatBarOverlayProps {
  timeSignature: TimeSignature
}

const BeatBarOverlay = ({ timeSignature }: BeatBarOverlayProps) => {
  const pattern: React.JSX.Element[] = []

  for (let i = 0; i < timeSignature.beats; i++) {
    pattern.push(
      <li className="flex-grow border" key={`beat-overlay-${i}}`}></li>
    )
  }

  return (
    <ul className="absolute inset-0 flex">
      {pattern}
    </ul>
  )
}

export default BeatBarOverlay
