import React from 'react'
import BeatGrid from '../../../components/mtts/beat-grid/beat-grid'

const Beats = () => {
  return (
    <div className="h-screen w-screen bg-red-200">
      <BeatGrid lineNumber={5} />
    </div>
  )
}

export default Beats
