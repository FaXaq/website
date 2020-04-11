// eslint-disable-next-line no-unused-vars
import { TempoState, INCREMENT_TEMPO, DECREMENT_TEMPO, SET_TEMPO } from './types'

export function incrementTempo (currentBpm: number) {
  return {
    type: INCREMENT_TEMPO,
    payload: {
      bpm: currentBpm + 1
    }
  }
}

export function decrementTempo (currentBpm: number) {
  return {
    type: DECREMENT_TEMPO,
    payload: {
      bpm: currentBpm - 1
    }
  }
}

export function setTempo (bpm: number) {
  return {
    type: SET_TEMPO,
    payload: {
      bpm
    }
  }
}
