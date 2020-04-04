import MTTSHeader from '../../components/mtts/header'
import BuildScale from '../../components/mtts/build-scale'
import React from 'react'

function HomePage () {
  return (
    <div className="font-sans">
      <MTTSHeader />
      <div className="container mx-auto p-4 md:px-0">
        <BuildScale />
      </div>
    </div>
  )
}

export default HomePage
