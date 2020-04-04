import React from 'react'

import { NOTES, Note, Pitch } from 'mtts'
import Tile from '../../components/mtts/malo/tile'
import TileLine from '../../components/mtts/malo/tile-line'
import TileContainer from '../../components/mtts/malo/tile-container'

function generateNotesForPitch (pitch: Pitch): Note[][] {
  const notes: Note[][] = []

  for (let note = 0; note < NOTES.length; note++) {
    const currentNote = new Note({
      name: NOTES[note],
      pitch
    })

    if (!currentNote.isCorF() && notes[notes.length - 1] !== undefined) {
      const currentFlatNote = currentNote.duplicate()
      currentFlatNote.addFlat()
      notes[notes.length - 1].push(
        currentFlatNote
      )
    }

    notes.push([
      currentNote
    ])

    if (!currentNote.isBorE()) {
      const currentSharpNote = currentNote.duplicate()
      currentSharpNote.addSharp()
      notes.push([
        currentSharpNote
      ])
    }
  }

  return notes
}

const Malo = () => {
  const tileLines: JSX.Element[] = []

  for (let i = 0; i < 8; i++) {
    const notesForPitch = generateNotesForPitch(new Pitch({ value: i })).map(n => (
      <Tile
        notes={n}
        key={`tile-${n[0].name}-${n[0].pitch.value}`}
      ></Tile>
    ))

    tileLines.push(<TileLine tiles={notesForPitch} />)
  }
  return <TileContainer tileLines={tileLines} />
}

export default Malo
