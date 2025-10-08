import { Note, Pitch } from 'mtts';
import React, { createContext, useContext, useState } from 'react';

import { FRET_MARKER } from './const';

export type GuitarNeckLayout = 'vertical' | 'horizontal'
export type GuitarTuning = Array<string>

const DEFAULT_GUITAR_TUNING: GuitarTuning = [
  FRET_MARKER,
  new Note({ name: 'E', pitch: new Pitch({ value: 4 }) }).SPN,
  new Note({ name: 'B', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'G', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'D', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'A', pitch: new Pitch({ value: 2 }) }).SPN,
  new Note({ name: 'E', pitch: new Pitch({ value: 2 }) }).SPN
];
const DEFAULT_FRET_NUMBER = 24;

interface GuitarNeckContextState {
  layout: GuitarNeckLayout,
  setGuitarNeckLayout: (layout: GuitarNeckLayout) => void,
  tuning: GuitarTuning,
  setGuitarTuning: (tuning: GuitarTuning) => void,
  fretNumber: number,
  setGuitarFretNumber: (fretNumber: number) => void
}

const INITIAL_STATE: GuitarNeckContextState = {
  layout: 'horizontal',
  setGuitarNeckLayout: () => { throw new Error('Function not implemented.'); },
  tuning: DEFAULT_GUITAR_TUNING,
  setGuitarTuning: () => { throw new Error('Function not implemented.');},
  fretNumber: DEFAULT_FRET_NUMBER,
  setGuitarFretNumber: () => { throw new Error('Function not implemented.');}
};

const GuitarNeckContext = createContext(INITIAL_STATE);
interface ProviderProps {
  children: React.ReactNode,
  value: Partial<GuitarNeckContextState>
}

export function GuitarNeckProvider({ children, value }: ProviderProps) {
  const [layout, setGuitarNeckLayout] = useState<GuitarNeckLayout>("horizontal");
  const [tuning, setGuitarTuning] = useState<GuitarTuning>(DEFAULT_GUITAR_TUNING);
  const [fretNumber, setGuitarFretNumber] = useState<number>(DEFAULT_FRET_NUMBER);

  const initialValue: GuitarNeckContextState = {
    layout: layout,
    setGuitarNeckLayout,
    tuning,
    setGuitarTuning,
    fretNumber,
    setGuitarFretNumber,
    ...value
  };

  return (
    <GuitarNeckContext.Provider value={initialValue}>
      {children}
    </GuitarNeckContext.Provider>
  );
}

export const useGuitarNeck = () => {
  const context = useContext(GuitarNeckContext);

  if (context === undefined) {
    throw new Error('useGuitarNeck must be used within GuitarNeckProvider');
  }

  return context;
};
