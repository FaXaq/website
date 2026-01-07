import type { Scale } from "@repo/mtts";
import type { Note } from "@repo/mtts";

import { getNoteInScale } from "./getNoteInScale";

export function noteExistsInScale(scale: Scale, note: Note): boolean {
  return getNoteInScale(scale, note) !== undefined;
}
