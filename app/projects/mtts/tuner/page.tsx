import React, { useEffect, useState } from 'react'
import NoMicAccess from './components/no-mic-access'
import TunerContainer from './components/tuner-container'

const Tuner = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>()

  useEffect(() => {
    // mandatory wrap in async function
    (async () => {
      try {
        setAudioStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])
  return (
    <div>
      {
        audioStream !== undefined
          ? <TunerContainer audioStream={audioStream} />
          : <NoMicAccess />
      }
    </div>
  )
}

export default Tuner
