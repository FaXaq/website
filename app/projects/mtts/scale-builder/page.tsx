'use client'

import React from 'react'
import BuildScale from './components'
import { ScaleBuilderSettingsProvider } from './context/settings'

const ScaleBuilder = () => {
  return (
    <ScaleBuilderSettingsProvider>
      <BuildScale />
    </ScaleBuilderSettingsProvider>
  )
}

export default ScaleBuilder
