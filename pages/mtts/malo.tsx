import React from 'react'

// eslint-disable-next-line no-unused-vars
import { Note, Pitch } from 'mtts'
import { generateNotesForPitch } from '../../utils/mtts'
import Tile from '../../components/mtts/malo/tile'
import TileLine from '../../components/mtts/malo/tile-line'
import TileContainer from '../../components/mtts/malo/tile-container'
import { usePolySynth } from '../../hooks/mtts/polysynth'
import '../../styles/malo.scss'

const Malo = () => {
  const lineLength = 20
  const tileLines: JSX.Element[] = []
  const tiles: JSX.Element[] = []
  const {
    startPlaying,
    stopPlaying,
    isPlaying
  } = usePolySynth()

  function playNotes (notes: Note[]) {
    if (!isPlaying(notes)) {
      startPlaying(notes)
    } else {
      stopPlaying(notes)
    }
  }

  for (let i = 1; i < 8; i++) {
    tiles.push(...generateNotesForPitch(new Pitch({ value: i })).map(notes =>
      <Tile
        playing={isPlaying(notes)}
        playNotes={playNotes}
        notes={notes}
        key={`tile-${notes.map(n => `${n.SPN}`).join('-')}`}
      ></Tile>)
    )
  }

  for (let i = 0; i < lineLength; i++) {
    const lineStart = i > 0 ? i * (lineLength - 12) : 0
    const lineStop = lineStart + lineLength
    tileLines.push(<TileLine
      index={i}
      tiles={tiles.slice(lineStart, lineStop)}
      key={`tile-line-${lineStart}-${lineStop}`}
    />)
  }

  return <div className="overflow-hidden bg-mtts-dark-violet">
    <TileContainer tileLines={tileLines} />
  </div>
}

export default Malo
