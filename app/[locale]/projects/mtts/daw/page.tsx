'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import Metronome from './components/Metronome'

function Daw() {
  return (
    <div >
      <div >
        <Metronome />
      </div>
      <div >
        <div >

        </div>
        <div >

        </div>
      </div>
    </div>
  )
}

export default dynamic(
  () => Promise.resolve(Daw),
  {
    ssr: false
  }
)
