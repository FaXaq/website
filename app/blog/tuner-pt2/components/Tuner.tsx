'use client'

import React, { useState } from 'react'
import TunerContainer from './TunerContainer'
import { Box } from '@chakra-ui/react'

export default function Tuner() {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>()

  async function requestMicAccess() {
    try {
      setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch (err) {
      console.error(err)
    }
  }

  return <Box p={6} rounded="md" border="1px solid">{
    audioStream !== undefined
      ? <TunerContainer audioStream={audioStream} />
      : <button onClick={() => requestMicAccess()}>Request mic access</button>
  }</Box>
}
