import { Score } from 'mtts';
import React, { useEffect,useState } from 'react';

import BeatLine from './beat-line';

interface BeatGridProps {
  lineNumber?: number
}

const BeatGrid = ({ lineNumber = 4 } : BeatGridProps) => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const s = Object.assign([], scores);
    if (s.length < lineNumber) {
      for (let i = s.length; i < lineNumber; i++) {
        s.push(new Score());
      }
    }
    setScores(s);
  }, [lineNumber]);

  const lines = scores.map((s, i) => (
    <li  key={i}>
      <BeatLine score={s} />
    </li>
  ));
  return (
    <ul >
      {lines}
    </ul>
  );
};

export default BeatGrid;
