import type { Scale } from "@repo/mtts";
import { Note } from "@repo/mtts";

import { getNoteInScale } from "./getNoteInScale";

export function noteExistsInScale(scale: Scale, note: Note | string): boolean {
  if (!(note instanceof Note)) return false;
  return getNoteInScale(scale, note) !== undefined;
}