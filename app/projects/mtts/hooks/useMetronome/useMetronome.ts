'use client'

import { useEffect, useRef, useState } from "react"
import { IncomingMessageType, OutgoingMessageType, OutgoingMessage } from "./worker/const"

type MetronomeCallback = (bipNumber: number) => any


export default function useMetronome(beatCallback: MetronomeCallback) {
  let bipNumber = 0
  const workerRef = useRef<Worker>(undefined)
  const callbackRef = useRef<MetronomeCallback>(undefined)
  const [bpm, setBpm] = useState<number>(60)
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    console.log('new callabck')
    callbackRef.current = beatCallback
  }, [beatCallback])

  function onMetronomeWorkerReceiveMessage(event: MessageEvent<OutgoingMessage>) {
    switch (event.data.type) {
    case OutgoingMessageType.BIP:
      callbackRef.current(bipNumber)
      bipNumber ++
      break;
    case OutgoingMessageType.BPM_UPDATE:
      const bpmUpdatePayload = event.data.payload as unknown as number
      setBpm(bpmUpdatePayload)
      break;
    case OutgoingMessageType.WORKING_UPDATE:
      const workingUpdatePayload = event.data.payload as unknown as boolean
      if (!workingUpdatePayload) {
        bipNumber = 0;
      }
      setIsActive(workingUpdatePayload)
      break;
    }
  }

  const updateBpm = (newBpm: number) => {
    workerRef.current?.postMessage({ type: IncomingMessageType.UPDATE_BPM, payload: newBpm })
  }

  const toggleMetronome = () => {
    workerRef.current?.postMessage({ type: IncomingMessageType.IS_WORKING, payload: !isActive })
  }
  
  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker/index', import.meta.url))
    workerRef.current.onmessage = onMetronomeWorkerReceiveMessage
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return {
    updateBpm,
    toggleMetronome,
    bpm,
    isActive,
  }
}