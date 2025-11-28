import { Interval, INTERVALS, Note,NOTES } from '@repo/mtts';

import type { Level } from './page';

export const LEVELS: { [key: string]: Level } = {
  easy: {
    notes: [new Note({ name: 'C' })],
    intervals: Object.keys(INTERVALS)
      .map(i => Interval.fromName(i))
      .reduce((previous, current) => {
        return previous.findIndex((pi) => current.semitones === pi.semitones) === -1 && current.semitones <= 12 && current.semitones > 0
          ? [...previous, current]
          : [...previous];
      }, []),
    intervalsToGuess: 1
  },
  intermediate: {
    notes: NOTES.map(n => new Note({ name: n })),
    intervals: Object.keys(INTERVALS)
      .map(i => Interval.fromName(i))
      .reduce((previous, current) => {
        return previous.findIndex((pi) => current.semitones === pi.semitones) === -1 && current.semitones <= 12 && current.semitones > 0
          ? [...previous, current]
          : [...previous];
      }, []),
    intervalsToGuess: 1
  }
};
