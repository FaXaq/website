'use client'

import React, { useState } from 'react'
import TunerContainer from './TunerContainer'

const Tuner = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>()

  async function requestMicAccess() {
    try {
      setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch (err) {
      console.error(err)
    }
  }

  return audioStream !== undefined
    ? <TunerContainer audioStream={audioStream} />
    : <button onClick={() => requestMicAccess()}>Request mic access</button>
}

export default Tuner
