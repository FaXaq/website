import React, { createContext, useContext, useRef, useState } from 'react';

import type { ITuning } from './tunings';
import { TUNINGS } from './tunings';

export type GuitarNeckLayout = 'vertical' | 'horizontal'

const DEFAULT_GUITAR_TUNING = TUNINGS.guitar_std;
const DEFAULT_FRET_NUMBER = 24;

interface GuitarNeckContextState {
  layout: GuitarNeckLayout,
  setGuitarNeckLayout: (layout: GuitarNeckLayout) => void,
  tuning: ITuning,
  setGuitarTuning: (tuning: ITuning) => void,
  fretNumber: number,
  setGuitarFretNumber: (fretNumber: number) => void,
  containerRef?: React.RefObject<HTMLDivElement | null>,
  isLefty: boolean,
  setIsLefty: (isLefty: boolean) => void
}

const INITIAL_STATE: GuitarNeckContextState = {
  layout: 'horizontal',
  setGuitarNeckLayout: () => { throw new Error('Function not implemented.'); },
  tuning: DEFAULT_GUITAR_TUNING,
  setGuitarTuning: () => { throw new Error('Function not implemented.'); },
  fretNumber: DEFAULT_FRET_NUMBER,
  setGuitarFretNumber: () => { throw new Error('Function not implemented.'); },
  containerRef: undefined,
  isLefty: false,
  setIsLefty: () => { throw new Error('Function not implemented.'); }
};

const GuitarNeckContext = createContext(INITIAL_STATE);
interface ProviderProps {
  children: React.ReactNode,
  value: Partial<GuitarNeckContextState>
}

export function GuitarNeckProvider({ children, value }: ProviderProps) {
  const [layout, setGuitarNeckLayout] = useState<GuitarNeckLayout>("horizontal");
  const [tuning, setGuitarTuning] = useState<ITuning>(DEFAULT_GUITAR_TUNING);
  const [fretNumber, setGuitarFretNumber] = useState<number>(DEFAULT_FRET_NUMBER);
  const [isLefty, setIsLefty] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialValue: GuitarNeckContextState = {
    layout: layout,
    setGuitarNeckLayout,
    isLefty,
    setIsLefty,
    tuning,
    setGuitarTuning,
    fretNumber,
    setGuitarFretNumber,
    containerRef,
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
