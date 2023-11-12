import { Note, Scale } from "mtts";

export function getNoteInScale(scale: Scale, note: Note): Note {
    return scale.notes.find(n => Note.getSemitonesBetween(note, n) % 12 === 0)
  }