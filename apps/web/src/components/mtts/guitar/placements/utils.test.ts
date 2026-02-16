import { Chord, Note } from '@repo/mtts';
import { describe, expect, it } from 'vitest';

import { findNoteOnNeck, findVoicings, getVoicingFingerings } from './utils';


const createGuitarNeckMatrix = () => {
  const stdTuning = [
    Note.fromSPN("E4"),
    Note.fromSPN("B4"),
    Note.fromSPN("G3"),
    Note.fromSPN("D3"),
    Note.fromSPN("A3"),
    Note.fromSPN("E2")
  ];

  return stdTuning.map((string) => {
    const frets = [];
    for (let i = 0; i <= 24; i++) {
      frets.push(
        string.duplicate().sharpenChromatically(i)
      );
    }
    return frets;
  });
};

describe('apps/web/src/components/mtts/guitar/placements', () => {
  describe('findNoteOnNeck', () => {
    it('Should find a note in a guitar neck, with equal semitones', () => {
      expect(
        findNoteOnNeck(
          createGuitarNeckMatrix(),
          [Note.fromSPN('C4')]
        ).map(n => ({ ...n, note: n.note.SPN }))
      ).toEqual([
        { fretIndex: 5, stringIndex: 2, note: 'C4' },
        { fretIndex: 10, stringIndex: 3, note: 'C4' },
        { fretIndex: 3, stringIndex: 4, note: 'C4' },
        { fretIndex: 20, stringIndex: 5, note: 'C4' }
      ]);
    });

    it('Should find a note in guitar neck, not filtering on octaves', () => {
      expect(
        findNoteOnNeck(
          createGuitarNeckMatrix(),
          [Note.fromSPN('C4')],
          { sameOctave: false }
        ).map(n => ({ ...n, note: n.note.SPN }))
      ).toEqual([
        { fretIndex: 8, stringIndex: 0, note: 'C5' },
        { fretIndex: 20, stringIndex: 0, note: 'C6' },
        { fretIndex: 1, stringIndex: 1, note: 'C5' },
        { fretIndex: 13, stringIndex: 1, note: 'C6' },
        { fretIndex: 5, stringIndex: 2, note: 'C4' },
        { fretIndex: 17, stringIndex: 2, note: 'C5' },
        { fretIndex: 10, stringIndex: 3, note: 'C4' },
        { fretIndex: 22, stringIndex: 3, note: 'C5' },
        { fretIndex: 3, stringIndex: 4, note: 'C4' },
        { fretIndex: 15, stringIndex: 4, note: 'C5' },
        { fretIndex: 8, stringIndex: 5, note: 'C3' },
        { fretIndex: 20, stringIndex: 5, note: 'C4' },
      ]);
    });

    it('Should find a note in guitar neck, filtering on frets', () => {
      expect(
        findNoteOnNeck(
          createGuitarNeckMatrix(),
          [Note.fromSPN('C4')],
          { sameOctave: false, fretFilter: (fret) => fret < 10 && fret > 0 }
        ).map(n => ({ ...n, note: n.note.SPN }))
      ).toEqual([
        { fretIndex: 8, stringIndex: 0, note: 'C5' },
        { fretIndex: 1, stringIndex: 1, note: 'C5' },
        { fretIndex: 5, stringIndex: 2, note: 'C4' },
        { fretIndex: 3, stringIndex: 4, note: 'C4' },
        { fretIndex: 8, stringIndex: 5, note: 'C3' },
      ]);
    });

    it('Should find a note in guitar neck, filtering on strings', () => {
      expect(
        findNoteOnNeck(
          createGuitarNeckMatrix(),
          [Note.fromSPN('C4')],
          { sameOctave: false, stringFilter: (string) => string === 3 }
        ).map(n => ({ ...n, note: n.note.SPN }))
      ).toEqual([
        { fretIndex: 10, stringIndex: 3, note: 'C4' },
        { fretIndex: 22, stringIndex: 3, note: 'C5' },
      ]);
    });
  });

  describe("findVoicings", () => {
    it("Should find all root voicings", () => {
      expect(
        findVoicings(
          createGuitarNeckMatrix(),
          new Chord({ root: Note.fromSPN('C4') }),
        ).map(v => v.map(n => ({ ...n, note: n.note.SPN })))
      ).toEqual([]);
    });
  });

  describe("getVoicingFingerings", () => {
    it.only("should place first fingers correctly", () => {
      expect(
        getVoicingFingerings(
          createGuitarNeckMatrix(),
          [
            { fretIndex: 3, stringIndex: 0, note: Note.fromSPN('G2') },
            { fretIndex: 2, stringIndex: 1, note: Note.fromSPN('B3') },
            { fretIndex: 0, stringIndex: 2, note: Note.fromSPN('D3') },
            { fretIndex: 0, stringIndex: 3, note: Note.fromSPN('G3') },
            { fretIndex: 0, stringIndex: 4, note: Note.fromSPN('B4') },
            { fretIndex: 3, stringIndex: 5, note: Note.fromSPN('G4') },
          ]
        )
      );
    });
  });
});
