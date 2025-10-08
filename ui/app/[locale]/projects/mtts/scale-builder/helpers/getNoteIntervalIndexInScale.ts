import type { Scale } from "mtts";
import { Note } from "mtts";

/**
 * return interval index in scale from note name
 * ie: if the scale is C major and we give an E, it will return a 3, because E is the major 3rd of C
 */
export function getNoteIntervalIndexInScale(scale: Scale, note: Note): number {
  const index = scale.notes.findIndex(n => Note.getSemitonesBetween(note, n) % 12 === 0);
  if (index < 0) {
    return -1;
  }
  return index;
}