import type { IncomingMessage } from "./const";
import { IncomingMessageType } from "./const";
import { setBpm, startMetronome, stopMetronome } from './utils';

addEventListener('message', (event: MessageEvent<IncomingMessage>) => {
  switch (event.data.type) {
    case IncomingMessageType.IS_WORKING: {
      const isWorkingPayload = event.data.payload as unknown as boolean;
      if (!isWorkingPayload) {
        stopMetronome();
      } else {
        startMetronome(true);
      }
      break;
    }
    case IncomingMessageType.UPDATE_BPM: {
      const updateBpmPayload = event.data.payload as unknown as number;
      setBpm(updateBpmPayload);
      break;
    }
    default:
      break;
  }
});