'use client';

import { Grid } from '@chakra-ui/react';
import { Note, Pitch } from '@repo/mtts';
import React from 'react';

import type { FGetFret, FHighlight } from './_guitar-fret';
import type { GuitarStringProps } from './_guitar-string';
import GuitarString from './_guitar-string';
import { FRET_MARKER } from './const';
import type { GuitarNeckLayout} from './context';
import { GuitarNeckProvider, useGuitarNeck } from './context';

const DEFAULT_GUITAR_TUNING = (() => [
  FRET_MARKER,
  new Note({ name: 'E', pitch: new Pitch({ value: 4 }) }).SPN,
  new Note({ name: 'B', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'G', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'D', pitch: new Pitch({ value: 3 }) }).SPN,
  new Note({ name: 'A', pitch: new Pitch({ value: 2 }) }).SPN,
  new Note({ name: 'E', pitch: new Pitch({ value: 2 }) }).SPN
])();
const DEFAULT_FRET_NUMBERS = 24;

export interface GuitarNeckProps {
  tuning?: string[],
  fretNumber?: number,
  highlightFret?: FHighlight,
  getFret?: FGetFret,
  layout?: GuitarNeckLayout
}

function GuitarNeck ({
  highlightFret = () => false,
  getFret = ({ note }) => note instanceof Note ? note.SPN : FRET_MARKER,
  tuning = DEFAULT_GUITAR_TUNING,
  fretNumber = DEFAULT_FRET_NUMBERS,
}: GuitarNeckProps) {
  const strings: GuitarStringProps[] = tuning.map((t, i) => ({
    tuning: t,
    highlightFret,
    getFret,
    fretNumber,
    stringNumber: i,
  }));
  const { layout, tuning: guitarTunning } = useGuitarNeck();
  const stringsInOrder = layout === "vertical" ? strings.reverse() : strings;

  return <Grid
    templateColumns={layout === "vertical" ? `repeat(${tuning.length}, minmax(0, 1fr))` : undefined }
    templateRows={layout === "horizontal" ? `repeat(${tuning.length}, minmax(0, 1fr))` : undefined }
  >
    { stringsInOrder.map((string) => <GuitarString key={`string-${string.stringNumber}`} {...string} />)}
  </Grid>;
}

export default function GuitarNeckWithProvider(props: GuitarNeckProps) {
  return (
    <GuitarNeckProvider value={{ layout: props.layout }}>
      <GuitarNeck {...props} />
    </GuitarNeckProvider>
  );
}
