import type { INTERVAL_NAME } from "@repo/mtts";
import { ACCIDENTAL, Accidental, ACCIDENTALS, Interval, INTERVALS, Note, NOTES } from "@repo/mtts";

import { theme } from "@/components/ui/theme";

import { COLOR } from "./helpers/getNoteColor";

export const getColorString = ({ color }: { color: COLOR }) => {
  switch (color) {
    case COLOR.YELLOW:
      return theme.colors["mtts-yellow"];
    case COLOR.KHAKI:
      return theme.colors["mtts-khaki"];
    case COLOR.GREEN:
      return theme.colors["mtts-green"];
    case COLOR.BLUE:
      return theme.colors["mtts-blue"];
    case COLOR.VIOLET:
      return theme.colors["mtts-violet"];
    case COLOR.RED:
      return theme.colors["mtts-red"];
    case COLOR.DEFAULT:
      return theme.colors["mtts-cta-1"];
    case COLOR.TRANSPARENT:
      return "trasparent";
  }
};

export const availableAccidentals: Accidental[] = ACCIDENTALS.filter(
  (a) => !a.includes("DOUBLE"),
).map(
  (a) =>
    new Accidental({
      semitones: ACCIDENTAL[a as keyof typeof ACCIDENTAL] ?? 0,
    }),
);

export const availableIntervals: {
  [key: number]: Interval[];
} = (() => {
  const intervals: { [key: number]: Interval[] } = {};
  Object.keys(INTERVALS)
    .filter(
      (i) =>
        INTERVALS[i as INTERVAL_NAME].semitones < 12 &&
        INTERVALS[i as INTERVAL_NAME].value < 8,
    )
    .forEach((interval) => {
      const intervalNumber = parseInt(interval.replace(/[a-zA-Z]/, ""));
      if (!intervals[intervalNumber]) {
        intervals[intervalNumber] = [];
      }

      intervals[intervalNumber].push(
        Interval.fromName(interval as INTERVAL_NAME),
      );
    });
  return intervals;
})();

export const INTERVAL_COLORS = Object.values(COLOR);

export const availableNotes: Note[] = NOTES.map((n) => new Note({ name: n }));
export const availableRootNotes: Note[] = [];
availableNotes.forEach((note) => {
  availableAccidentals.forEach((accidental) => {
    availableRootNotes.push(
      new Note({
        name: note.name,
        accidental: new Accidental({ semitones: accidental.semitones }),
      }),
    );
  });
});
