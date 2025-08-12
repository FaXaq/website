'use client'

import React from 'react'
import BuildScale from './components'
import { ScaleBuilderSettingsProvider } from './context/settings'

const ScaleBuilder = () => {
  return (
    <div >
      <ScaleBuilderSettingsProvider>
        <BuildScale />
      </ScaleBuilderSettingsProvider>
    </div>
  )
}

export default ScaleBuilder
