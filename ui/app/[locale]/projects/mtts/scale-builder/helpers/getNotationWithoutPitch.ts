import type { Note } from "mtts";

export function getNotationWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/, '');
}