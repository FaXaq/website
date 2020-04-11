// eslint-disable-next-line no-unused-vars
import { TempoState, TempoActionTypes, SET_TEMPO, DECREMENT_TEMPO, INCREMENT_TEMPO } from './types'

const initialState: TempoState = {
  bpm: 140
}

export default function tempoReducer (
  state = initialState,
  action: TempoActionTypes
): TempoState {
  switch (action.type) {
    case INCREMENT_TEMPO: {
      return {
        ...state,
        ...action.payload
      }
    }
    case DECREMENT_TEMPO: {
      return {
        ...state,
        ...action.payload
      }
    }
    case SET_TEMPO: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
