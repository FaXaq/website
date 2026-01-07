import type { Chord } from "@repo/mtts";
import { Note } from "@repo/mtts";

export function getNoteInChord(chord: Chord, note: Note): Note {
  return chord.notes.find(n => Note.getSemitonesBetween(note, n) % 12 === 0)!;
}
