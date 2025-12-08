'use client';

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { GuessedNote } from './TunerContainer';

interface GuessedNoteProps {
  guessedNote: GuessedNote;
  fqRatio: number;
}

function getEquation (note: GuessedNote): {multiplier: number, additioner: number} {
  const fq = note.notes[0].frequency;
  const fqInf = fq - note.diffs[0];
  const fqSup = fq + note.diffs[1];
  const ampInf = note.values[0];
  const ampSup = note.values[1];

  return {
    multiplier: (ampInf - ampSup) / (fqInf - fqSup),
    additioner: (ampInf - (fqInf * (ampInf - ampSup) / (fqInf - fqSup)))
  };
}

const GuessedNoteItem = ({ guessedNote, fqRatio }: GuessedNoteProps) => {
  const spn = guessedNote.notes.map(n => n.SPN).join('/');
  const c1 = (guessedNote.diffs[0] / fqRatio) * 100;
  const c2 = (guessedNote.diffs[1] / fqRatio) * 100;
  const { multiplier } = getEquation(guessedNote);

  return (<>
    <Text> SPN : {spn}</Text>
    <Text> Amplitude diff : {guessedNote.values[0] - guessedNote.values[1]}</Text>
    <Text> Coeff diff : {c1 - c2}</Text>
    <Text> note frequency : {guessedNote.notes[0].frequency}</Text>
    <Text> Line equation multiplier : {multiplier}</Text>
    <Text>---------------------------</Text>
  </>
  );
};

export default GuessedNoteItem;
