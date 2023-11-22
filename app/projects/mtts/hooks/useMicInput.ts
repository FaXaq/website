import { useMemo, useState } from "react"

export default function useMicInput() {
  const [micStream, setMicStream] = useState<MediaStream | undefined>()
  const [error, setError] = useState()

  async function requestAccess() {
    try {
      setMicStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch (err) {
      setError(err)
      console.error(err)
    }
  }

  const isActive = useMemo(() => {
    return micStream !== undefined
  }, [micStream])

  return {
    micStream,
    isActive,
    requestAccess
  }
}