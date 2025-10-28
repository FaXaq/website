'use client';

import './malo.scss';

import type { Note} from 'mtts';
import { Pitch } from 'mtts';
import React, { useMemo,useState } from 'react';

import { generateNotesForPitch } from '@/utils/mtts';

import TileContainer from './components/tile-container';

const Malo = () => {
  const [lineLength] = useState(20);
  const [lineNumber] = useState(10);

  const notes = useMemo(() => {
    const n: Note[][] = [];
    for (let i = 1; i < lineNumber + 1; i++) {
      n.push(...generateNotesForPitch(new Pitch({ value: i })));
    }

    return n;
  }, [lineNumber]);

  return <div >
    <TileContainer lineLength={lineLength} lineNumber={lineNumber} notes={notes} />
  </div>;
};

export default Malo;
