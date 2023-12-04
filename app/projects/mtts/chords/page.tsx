'use client'

import React, { useEffect } from 'react'
import { Chord, Note, Scale } from "mtts"
import { getNotationWithoutPitch } from "../scale-builder/helpers/getNotationWithoutPitch"

export default function Chords() {
  const scale = new Scale({ key: Note.fromSPN("C4"), name: "major" })

  function generateMaxChord(note: Note) {
    const root = note.duplicate()
    const otherNotes = scale.notes.filter(n => n.SPN !== note.SPN)
    const chord = new Chord({ 
      root,
      notes: [
        root,
        ...otherNotes
      ]
    })
    console.log(chord.notes.map(n => n.SPN))
    console.log(chord.notation)
  }

  return <div className="p-4">
    <p>Scale : {getNotationWithoutPitch(scale.key)} {scale.name}</p>
    <p>Degrees : </p>
    <ul>
      { scale.notes.map(note => (
        <li key={`note-${note.SPN}`} onClick={() => generateMaxChord(note)}>{getNotationWithoutPitch(note)}</li>
      ))}
    </ul>
  </div>
}