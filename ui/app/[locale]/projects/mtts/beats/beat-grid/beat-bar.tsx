'use client';

import type { Bar } from 'mtts';
import React from 'react';

import BeatBarOverlay from './beat-bar-overlay';

interface BeatBarProps {
  bar: Bar
}

const BeatBar = ({ bar }: BeatBarProps) => {
  const content = bar.content.map((c, i) => {
    return (
      <li key={`beat-bar-${i}`}  style={{ width: `${(c.dottedValue * 100)}%` }}>
        { JSON.stringify(c) }
      </li>
    );
  });

  return (
    <div >
      <BeatBarOverlay timeSignature={ bar.timeSignature } />
      <ul >
        { content }
      </ul>
    </div>
  );
};

export default BeatBar;
