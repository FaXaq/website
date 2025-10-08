/* eslint-disable no-unused-vars */
import type { Reducer} from 'react';
import React, { createContext, useContext, useReducer } from 'react';

export enum NOTE_DISPLAY {
  SCALE_DEGREE = "Scale degree",
  NOTE_NAME = "Note name",
  BOTH = "Both"
}

interface ScaleBuilderSettingsContextState {
  noteDisplay: NOTE_DISPLAY,
  setNoteDisplay: (payload: NOTE_DISPLAY) => void,
}
const INITIAL_STATE: ScaleBuilderSettingsContextState = {
  noteDisplay: NOTE_DISPLAY.NOTE_NAME,
  setNoteDisplay: function() { throw new Error('Function not implemented.'); }
};

enum ACTION_TYPE {
    SET_NOTE_DISPLAY = 'SET_NOTE_DISPLAY'
}

const ScaleBuilderSettingsContext = createContext(INITIAL_STATE);

const ScalebuilderContextReducer: Reducer<ScaleBuilderSettingsContextState, { type: ACTION_TYPE, payload: NOTE_DISPLAY }> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
  case ACTION_TYPE.SET_NOTE_DISPLAY:
    return {
      ...state,
      noteDisplay: payload
    };
  default:
  }

  return { ...state };
};

interface ProviderProps {
  children: React.ReactNode
}

export function ScaleBuilderSettingsProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(ScalebuilderContextReducer, INITIAL_STATE);

  const setNoteDisplay = (noteDisplay: NOTE_DISPLAY) => {
    dispatch({ type: ACTION_TYPE.SET_NOTE_DISPLAY, payload: noteDisplay });
  };

  const value: ScaleBuilderSettingsContextState = {
    noteDisplay: state.noteDisplay,
    setNoteDisplay
  };

  return (
    <ScaleBuilderSettingsContext.Provider value={value}>
      {children}
    </ScaleBuilderSettingsContext.Provider>
  );
}

export const useScaleBuilderSettings = () => {
  const context = useContext(ScaleBuilderSettingsContext);

  if (context === undefined) {
    throw new Error('useActiveChartPoint must be used within ScaleBuilderSettingsProvider');
  }

  return context;
};
