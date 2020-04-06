import React, { useState } from 'react'

import { NOTES, Note, Pitch } from 'mtts'
import Tile from '../../components/mtts/malo/tile'
import TileLine from '../../components/mtts/malo/tile-line'
import TileContainer from '../../components/mtts/malo/tile-container'

import { PolySynth, Synth } from 'tone'

import '../../styles/malo.scss'

function generateNotesForPitch (pitch: Pitch): Note[][] {
  const notes: Note[][] = []

  for (let note = 0; note < NOTES.length; note++) {
    const currentNote = new Note({
      name: NOTES[note],
      pitch
    })

    if (!currentNote.isCorF() && notes[notes.length - 1] !== undefined) {
      notes[notes.length - 1].push(currentNote.duplicate().addFlat())
    }

    notes.push([
      currentNote
    ])

    if (!currentNote.isBorE()) {
      notes.push([currentNote.duplicate().addSharp()])
    }
  }

  return notes
}

const Malo = () => {
  const lineLength = 20
  const tileLines: JSX.Element[] = []
  const tiles: JSX.Element[] = []
  const [playingNotes, setPlayingNotes] =
    useState<{ [key: string ]: boolean }>({})

  function playNotes (notes: Note[]) {
    const t = new PolySynth({ voice: Synth }).toDestination()
    t.triggerAttackRelease(notes.map(n => n.frequency), 1)
    setPlayingNotes(prevState =>
      ({ ...prevState, [notes.map(n => n.SPN).join('-')]: true })
    )
    setTimeout(() => {
      setPlayingNotes(prevState =>
        ({ ...prevState, [notes.map(n => n.SPN).join('-')]: false })
      )
    }, 1000)
  }

  for (let i = 1; i < 8; i++) {
    tiles.push(...generateNotesForPitch(new Pitch({ value: i })).map(notes =>
      <Tile
        playingNotes={playingNotes}
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
