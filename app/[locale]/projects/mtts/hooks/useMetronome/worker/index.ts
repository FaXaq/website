import { IncomingMessageType } from "./const"
import { IncomingMessage } from "./const"
import { startMetronome, stopMetronome, setBpm } from './utils'

addEventListener('message', (event: MessageEvent<IncomingMessage>) => {
  console.log('worker received message =>', event.data)
  switch (event.data.type) {
  case IncomingMessageType.IS_WORKING:
    const isWorkingPayload = event.data.payload as unknown as boolean;
    if (!isWorkingPayload) {
      stopMetronome()
    } else {
      startMetronome(true)
    }
    break
  case IncomingMessageType.UPDATE_BPM:
    const updateBpmPayload = event.data.payload as unknown as number;
    setBpm(updateBpmPayload)
  default:
    break;
  }
})