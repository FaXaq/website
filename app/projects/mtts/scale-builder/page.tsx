'use client'

import React from 'react'
import BuildScale from './components'
import { ScaleBuilderSettingsProvider } from './context/settings'

const ScaleBuilder = () => {
  return (
    <div className="container mx-auto py-8">
      <ScaleBuilderSettingsProvider>
        <BuildScale />
      </ScaleBuilderSettingsProvider>
    </div>
  )
}

export default ScaleBuilder
