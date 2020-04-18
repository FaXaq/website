import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Note } from 'mtts'
import TileLine from './tile-line'
import { useMaloSynth } from '../../../hooks/mtts/malosynth'

interface TileContainerProps {
  notes: Note[][];
  lineLength: number;
  lineNumber: number;
}

const TileContainer = ({ notes, lineLength, lineNumber }: TileContainerProps) => {
  const tileLines: JSX.Element[] = []
  const {
    startPlaying,
    stopPlaying,
    isPlaying
  } = useMaloSynth()

  function playNotes (notes: Note[]) {
    if (!isPlaying(notes)) {
      startPlaying(notes)
    } else {
      stopPlaying(notes)
    }
  }

  for (let i = 0; i < lineNumber; i++) {
    const lineStart = i > 0 ? i * (lineLength - 12) : 0
    const lineStop = lineStart + lineLength
    tileLines.push(<TileLine
      index={i}
      notes={notes.slice(lineStart, lineStop)}
      key={`tile-line-${lineStart}-${lineStop}`}
      isPlaying={isPlaying}
      playNotes={playNotes}
    />)
  }

  return <div className="flex flex-col h-screen">{tileLines}</div>
}

export default TileContainer
