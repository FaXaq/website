import { OutgoingMessageType } from "./const";

const DEFAULT_TIMEOUT_VALUE = -1;
let timeout = DEFAULT_TIMEOUT_VALUE;
let bpm = 60;
let now = Date.now();

function isMetronomeWorking() {
  return timeout !== DEFAULT_TIMEOUT_VALUE;
}

export function startMetronome(startDirectly?: boolean) {
  // Indicating that we start the metronome fresh
  if (!isMetronomeWorking()) {
    postMessage({
      type: OutgoingMessageType.WORKING_UPDATE,
      payload: true
    });
  }

  // If asked, we can fire a bip directly, without waiting for the first timeout
  if (startDirectly) {
    postMessage({
      type: OutgoingMessageType.BIP
    });
  }

  // This is the bit where the metronome works
  // We leverage setTimeout within a Service Worker
  // to avoid colliding with rendering and other JS work
  timeout = setTimeout(() => {
    postMessage({
      type: OutgoingMessageType.BIP
    });

    now = Date.now();

    startMetronome(false);
  }, (60 / bpm) * 1000) as unknown as number;
}

export function stopMetronome() {
  // Stop the current timeout
  clearTimeout(timeout);

  // Reset the timeout
  timeout = DEFAULT_TIMEOUT_VALUE;

  // Indicate to the user we've stopped the worker
  postMessage({
    type: OutgoingMessageType.WORKING_UPDATE,
    payload: false
  });
}

export function setBpm(localBpm: number) {
  bpm = localBpm;

  // Inform the user we've updated the bpm
  postMessage({
    type: OutgoingMessageType.BPM_UPDATE,
    payload: localBpm
  });
}