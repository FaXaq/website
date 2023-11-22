'use client'

import React from 'react'
import Metronome from './components/Metronome'

function Daw() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="w-full">
        <Metronome />
      </div>
      <div className="grow w-full grid grid-cols-6">
        <div className="col-span-1 bg-mtts-violet">

        </div>
        <div className="col-span-5">

        </div>
      </div>
    </div>
  )
}

export default Daw
