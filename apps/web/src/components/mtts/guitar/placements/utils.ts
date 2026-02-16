import type { Chord } from "@repo/mtts";
import { Note } from "@repo/mtts";
import z from "zod/v3";

export const CAGEDZodEnum = z.enum(['C', 'A', 'G', 'E', 'D', 'CUSTOM']);
export type CAGEDType = z.infer<typeof CAGEDZodEnum>;
export const CAGEDEnum = CAGEDZodEnum.Enum;

export const FingerZodEnum = z.enum(['T', 'I', 'M', 'A', 'P']);
export type FingerType = z.infer<typeof FingerZodEnum>;
export const FingerEnum = FingerZodEnum.Enum;

/**
 * Represents a note position on the guitar neck
 */
export interface NotePosition {
  stringIndex: number;
  fretIndex: number;
  note: Note;
}

interface NotePoisitionWithFingering extends NotePosition {
  finger: FingerType;
}

interface FindNoteOnNeckOptions {
  sameOctave?: boolean;
  stringFilter?: (stringIndex: number) => boolean;
  fretFilter?: (fretIndex: number) => boolean;
}

export const findNoteOnNeck = (
  neckMatrix: Note[][],
  notes: Note[],
  { sameOctave = true, stringFilter = () => true, fretFilter = () => true }: FindNoteOnNeckOptions = {}
): NotePosition[] => {
  const positions: NotePosition[] = [];

  neckMatrix.forEach((stringNotes, stringIndex) => {
    stringNotes.forEach((fretNote, fretIndex) => {
      notes.forEach(note => {
        if (
          (sameOctave && Note.getSemitonesBetween(note, fretNote) === 0) ||
          (!sameOctave && Note.getSemitonesBetween(note, fretNote, true) === 0)
        ) {
          if (stringFilter(stringIndex) && fretFilter(fretIndex))
            positions.push({ stringIndex, fretIndex, note: fretNote });
        }
      });
    });
  });

  return positions;
};

const computeFretRange = (voicing: NotePosition[], fretSpan: number) => {
  const minFret = Math.min(...voicing.map(({ fretIndex }) => fretIndex));
  const maxFret = Math.max(...voicing.map(({ fretIndex }) => fretIndex));
  return { minFret: maxFret - fretSpan + 1, maxFret: minFret + fretSpan - 1 };
};

interface FindVoicingsOptions {
  keepRootInLowestPosition?: boolean;
  fretSpan?: number
  findInversions?: boolean
  allowOpenStrings?: boolean,
  allowStringSkips?: boolean
}

/**
 * Without inversions
 * 1. Find roots on the neck, and create a stack with all possibilities
 * 2. For item in the stack apply the following :
 *   2.1 Verify exit conditions :
 *     2.1.1 All strings have been covered
 *     2.1.2 No more notes can be added (in the fret range on the next string)
 *   2.2 Check if we can find another note from the chord on the next string, add note to the possible voicing and push the new voicing to the stack
 */
export const findVoicings = (
  neckMatrix: Note[][],
  chord: Chord,
  {
    keepRootInLowestPosition = true,
    findInversions = false,
    fretSpan = 4,
    allowOpenStrings = true,
    allowStringSkips = false
  }: FindVoicingsOptions = {}
): NotePosition[][] => {
  const voicings: NotePosition[][] = [];
  const stack = findNoteOnNeck(
    neckMatrix,
    [chord.root],
    { sameOctave: false, fretFilter: (fretNumber) => fretNumber < 12 })
    .filter(n => n.stringIndex == 5)
    .map(n => [n]);

  if (stack.length === 0) return [];

  while (stack.length > 0) {
    const voicing = stack.pop()!;
    const fretRange = computeFretRange(voicing, fretSpan);
    const maxString = Math.min(...voicing.map(v => v.stringIndex));
    const possibleNextNotes = findNoteOnNeck(
      neckMatrix,
      chord.notes,
      {
        sameOctave: false,
        fretFilter: (fretNumber) => fretNumber >= fretRange.minFret && fretNumber <= fretRange.maxFret,
        stringFilter: (stringIndex) => stringIndex < maxString && stringIndex > maxString - 3
      });

    if (chord.notes.every(n => voicing.some(vn => Note.getSemitonesBetween(n, vn.note, true) === 0))) {
      voicings.push(voicing);
    }

    possibleNextNotes.forEach(nextNote => {
      const newVoicing = [...voicing, nextNote];
      if (newVoicing.length <= neckMatrix.length) {
        stack.push(newVoicing);
      }
    });
  }

  return voicings
    .sort((a, b) => {
      const aMinFret = Math.min(...a.map(n => n.fretIndex + n.stringIndex));
      const bMinFret = Math.min(...b.map(n => n.fretIndex + n.stringIndex));
      return aMinFret - bMinFret;
    });
};

/**
 * T: Can add thumb if on last string, and no other fingers before
 * I: Can add index finger if:
 *   - no previous position
 *   - previous position has index & no previous position has lower fret
 *   - previous position has no index & thumb on the same fret
 *   - previous position has no index & is on previous 1 string bellow & M
 */
export const findPossibleFingerForPosition = (
  neckMatrix: Note[][],
  previousPositions: NotePoisitionWithFingering[],
  position: NotePosition
): NotePoisitionWithFingering[][] => {
  const fingerings: NotePoisitionWithFingering[][] = [];
  if (previousPositions.length === 0
    && neckMatrix.length - 1 === position.stringIndex) {
    fingerings.push([{ ...position, finger: FingerEnum.T }]);
  }

  return fingerings;
};

export const getVoicingFingerings = (neckMatrix: Note[][], voicing: NotePosition[]): NotePoisitionWithFingering[][] => {
  if (voicing.length === 0 || voicing[0] === undefined) return [];

  const fingerings: NotePoisitionWithFingering[][] = [];
  const stack = findPossibleFingerForPosition(neckMatrix, [], voicing[0]);
  console.log(stack);

  if (stack.length === 0) return [];

  return fingerings;
};
