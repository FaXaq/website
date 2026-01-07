import type { Chord } from "@repo/mtts";

export const isSameChord = (chord1: Chord, chord2?: Chord | null): boolean => {
  if (!chord1 || !chord2) return false;
  return chord1.root.name === chord2.root.name && chord1.notation === chord2.notation;
};
