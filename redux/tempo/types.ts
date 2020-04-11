export interface TempoState {
  bpm: number
}

export const INCREMENT_TEMPO = 'INCREMENT_TEMPO'

interface IncrementTempo {
  type: typeof INCREMENT_TEMPO;
  payload: TempoState;
}

export const DECREMENT_TEMPO = 'DECREMENT_TEMPO'

interface DecrementTempo {
  type: typeof DECREMENT_TEMPO;
  payload: TempoState;
}

export const SET_TEMPO = 'SET_TEMPO'

interface SetTempo {
  type: typeof SET_TEMPO;
  payload: TempoState;
}

export type TempoActionTypes = IncrementTempo | DecrementTempo | SetTempo
