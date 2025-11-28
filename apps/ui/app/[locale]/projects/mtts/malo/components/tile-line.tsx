'use client';


import type { Note } from '@repo/mtts';
import React from 'react';

import Tile from './tile';

interface TileLineProps {
  index: number;
  notes: Note[][];
  isPlaying: (notes: Note[]) => boolean;
  playNotes: (notes: Note[]) => void;
}

const TileLine = ({ notes, index, isPlaying, playNotes }: TileLineProps) => {
  const tiles = notes.map(n =>
    <div
      onClick={() => playNotes(n)}
      key={`tile-${n.map(sn => `${sn.SPN}`).join('-')}`}
    >
      <Tile
        playing={isPlaying(n)}
        notes={n}
      ></Tile>
    </div>
  );

  return (
    <div>
      {tiles}
    </div>
  );
};

export default React.memo(TileLine);
