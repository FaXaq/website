import { Note, Scale } from "mtts"
import { getNoteInScale } from "./getNoteInScale"

export function noteExistsInScale(scale: Scale, note: Note | string): boolean {
  if (!(note instanceof Note)) return false
  return getNoteInScale(scale, note) !== undefined
}