import type { Chord } from "@repo/mtts";
import type { Note } from "@repo/mtts";

import { getNoteInChord } from "./getNoteInChord";

export function noteExistsInChord(chord: Chord, note: Note): boolean {
  return getNoteInChord(chord, note) !== undefined;
}
