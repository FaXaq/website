'use client'

import React, { useState } from 'react'
import TunerContainer from './TunerContainer'
import { Box, Button } from '@chakra-ui/react'

const Tuner = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>()

  async function requestMicAccess() {
    try {
      setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch (err) {
      console.error(err)
    }
  }

  return <Box rounded="md" p={6} border="1px solid" width="100%">
    {audioStream !== undefined
      ? <TunerContainer audioStream={audioStream} />
      : <Button onClick={() => requestMicAccess()} cursor="pointer">Request mic access</Button>
    }
  </Box>
}

export default Tuner
