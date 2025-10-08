'use client';

// eslint-disable-next-line no-unused-vars
import type { Score } from 'mtts';
import { Note, NOTE_VALUES,Rest } from 'mtts';
import React from 'react';

import BeatBar from './beat-bar';

interface BeatLineProps {
  score: Score;
}

const BeatLine = ({ score }: BeatLineProps) => {
  score.addBar({
    content: [new Rest({ value: NOTE_VALUES.SIXTEENTH, dots: 1 }), new Note({ name: 'A', value: NOTE_VALUES.EIGHT })]
  });
  const bars = score.bars.map((b, i) => {
    return (
      <BeatBar bar={b} key={`bar-${i}`}/>
    );
  });
  return (
    <div >
      { bars }
    </div>
  );
};

export default BeatLine;
