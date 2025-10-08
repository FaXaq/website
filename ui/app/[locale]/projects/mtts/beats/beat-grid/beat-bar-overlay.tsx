'use client';

// eslint-disable-next-line no-unused-vars
import type { TimeSignature } from 'mtts';
import React from 'react';

interface BeatBarOverlayProps {
  timeSignature: TimeSignature
}

const BeatBarOverlay = ({ timeSignature }: BeatBarOverlayProps) => {
  const pattern: React.JSX.Element[] = [];

  for (let i = 0; i < timeSignature.beats; i++) {
    pattern.push(
      <li  key={`beat-overlay-${i}}`}></li>
    );
  }

  return (
    <ul >
      {pattern}
    </ul>
  );
};

export default BeatBarOverlay;
