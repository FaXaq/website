import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import Tile from './tile'
import classNames from 'classnames'

interface TileLineProps {
  index: number;
  notes: Note[][];
  isPlaying: (notes: Note[]) => boolean;
  playNotes: (notes: Note[]) => void;
}

const TileLine = ({ notes, index, isPlaying, playNotes }: TileLineProps) => {
  const tiles = notes.map(n =>
    <Tile
      playing={isPlaying(n)}
      playNotes={playNotes}
      notes={n}
      key={`tile-${n.map(sn => `${sn.SPN}`).join('-')}`}
    ></Tile>
  )

  return (
    <div className={classNames({
      'line flex': true,
      'odd-line': index % 2 !== 0
    })}>
      {tiles}
    </div>
  )
}

export default TileLine
