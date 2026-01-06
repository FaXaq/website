import { useEffect, useRef, useState } from "react";

import type { OutgoingMessage } from "./worker/const";
import { IncomingMessageType, OutgoingMessageType } from "./worker/const";
import Worker from "./worker?worker";

type MetronomeCallback = (bipNumber: number) => void


export default function useMetronome(beatCallback: MetronomeCallback) {
  const bipNumberRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const callbackRef = useRef<MetronomeCallback>(undefined);
  const [bpm, setBpm] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    callbackRef.current = beatCallback;
  }, [beatCallback]);

  function onReceiveMessageFromWorker(event: MessageEvent<OutgoingMessage>) {
    switch (event.data.type) {
      case OutgoingMessageType.BIP:
        callbackRef?.current?.(bipNumberRef.current);
        bipNumberRef.current++;
        break;
      case OutgoingMessageType.BPM_UPDATE: {
        const bpmUpdatePayload = event.data.payload as unknown as number;
        setBpm(bpmUpdatePayload);
        break;
      }
      case OutgoingMessageType.WORKING_UPDATE: {
        const workingUpdatePayload = event.data.payload as unknown as boolean;
        if (!workingUpdatePayload) {
          bipNumberRef.current = 0;
        }
        setIsActive(workingUpdatePayload);
        break;
      }
    }
  }

  const updateBpm = (newBpm: number) => {
    workerRef.current?.postMessage({ type: IncomingMessageType.UPDATE_BPM, payload: newBpm });
  };

  const toggleMetronome = () => {
    workerRef.current?.postMessage({ type: IncomingMessageType.IS_WORKING, payload: !isActive });
  };

  useEffect(() => {
    // Create the worker inside useEffect so it's properly managed within React's lifecycle
    const worker = new Worker();
    workerRef.current = worker;
    worker.onmessage = onReceiveMessageFromWorker;

    return () => {
      // Cleanup: terminate the worker when component unmounts
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  return {
    updateBpm,
    toggleMetronome,
    bpm,
    isActive,
  };
}