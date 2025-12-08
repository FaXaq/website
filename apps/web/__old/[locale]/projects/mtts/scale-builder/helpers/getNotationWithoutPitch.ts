import type { Note } from "@repo/mtts";

export function getNotationWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/, '');
}