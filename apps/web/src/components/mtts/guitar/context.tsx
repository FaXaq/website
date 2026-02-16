import type { Chord } from '@repo/mtts';
import type { Note } from '@repo/mtts';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

import type { CAGEDType } from './placements/utils';
import { CAGEDEnum } from './placements/utils';
import type { ITuning } from './tunings';
import { TUNINGS } from './tunings';

export type GuitarNeckLayout = 'vertical' | 'horizontal'

const DEFAULT_GUITAR_TUNING = TUNINGS.guitar_std;
const DEFAULT_FRET_NUMBER = 24;

interface GuitarNeckContextState {
  layout: GuitarNeckLayout,
  setGuitarNeckLayout: React.Dispatch<React.SetStateAction<GuitarNeckLayout>>,
  tuning: ITuning,
  setGuitarTuning: React.Dispatch<React.SetStateAction<ITuning>>,
  fretNumber: number,
  setGuitarFretNumber: React.Dispatch<React.SetStateAction<number>>,
  containerRef?: React.RefObject<HTMLDivElement | null>,
  isLefty: boolean,
  setIsLefty: React.Dispatch<React.SetStateAction<boolean>>,
  focusedChord: Chord | undefined,
  setFocusedChord: (chord: Chord | undefined) => void,
  CAGED: CAGEDType,
  setCAGED: React.Dispatch<React.SetStateAction<CAGEDType>>,
  CAGEDRange: { start: number, end: number },
  setCAGEDRange: React.Dispatch<React.SetStateAction<{ start: number, end: number }>>,
  neckMatrix: Note[][],
  focusedFrets: { stringIndex: number, fretIndex: number }[],
  setFocusedFrets: React.Dispatch<React.SetStateAction<{ stringIndex: number, fretIndex: number }[]>>
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
  setIsLefty: () => { throw new Error('Function not implemented.'); },
  focusedChord: undefined,
  setFocusedChord: () => { throw new Error('Function not implemented.'); },
  CAGED: "C",
  setCAGED: () => { throw new Error('Function not implemented.'); },
  CAGEDRange: { start: 0, end: 12 },
  setCAGEDRange: () => { throw new Error('Function not implemented.'); },
  neckMatrix: [],
  focusedFrets: [],
  setFocusedFrets: () => { throw new Error('Function not implemented.'); }
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
  const [focusedChord, setFocusedChord] = useState<Chord | undefined>(undefined);
  const [CAGED, setCAGED] = useState<CAGEDType>(CAGEDEnum.C);
  const [CAGEDRange, setCAGEDRange] = useState<{ start: number; end: number }>({ start: 0, end: DEFAULT_FRET_NUMBER });
  const [focusedFrets, setFocusedFrets] = useState<{ stringIndex: number, fretIndex: number }[]>([]);

  const neckMatrix = useMemo(() => {
    return tuning.strings.map((string) => {
      const frets = [];
      for (let i = 0; i < fretNumber; i++) {
        const note = string.note.duplicate();
        frets.push(note.sharpenChromatically(i));
      }
      return frets;
    });
  }, [tuning, fretNumber]);

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
    focusedChord,
    setFocusedChord,
    CAGED,
    setCAGED,
    CAGEDRange,
    setCAGEDRange,
    neckMatrix,
    focusedFrets,
    setFocusedFrets,
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
