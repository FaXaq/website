import type { Scale } from "@repo/mtts";
import { Note } from "@repo/mtts";

export enum COLOR {
  DEFAULT = 'color-default',
  YELLOW = 'color-yellow',
  KHAKI = 'color-khaki',
  GREEN = 'color-green',
  BLUE = 'color-blue',
  VIOLET = 'color-violet',
  RED = 'color-red'
}

export function getNoteColor(scale: Scale, note: Note): COLOR | undefined {
  const index = scale.notes.findIndex(n => Note.getSemitonesBetween(note, n) % 12 === 0);
  if (index < 0) {
    return;
  }

  const interval = scale.intervals[index];
  switch (interval.value) {
  case 0:
    return;
  case 1:
    return COLOR.DEFAULT;
  case 2:
    return COLOR.YELLOW;
  case 3:
    return COLOR.KHAKI;
  case 4:
    return COLOR.GREEN;
  case 5:
    return COLOR.BLUE;
  case 6:
    return COLOR.VIOLET;
  case 7:
    return COLOR.RED;
  }
}