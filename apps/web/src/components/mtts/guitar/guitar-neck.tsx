import { Box, Grid } from '@chakra-ui/react';
import { Note } from '@repo/mtts';
import React from 'react';

import type { FGetFret, FHighlight } from './_guitar-fret';
import { GuitarFretMarkerContainer } from './_guitar-fret-marker';
import type { GuitarStringProps } from './_guitar-string';
import GuitarString from './_guitar-string';
import { FRET_MARKER } from './const';
import type { GuitarNeckLayout } from './context';
import { GuitarNeckProvider, useGuitarNeck } from './context';
import { GuitarTuning } from './guitar-tuning';
import type { ITuning } from './tunings';

export interface GuitarNeckProps {
  tuning?: ITuning,
  fretNumber?: number,
  highlightFret?: FHighlight,
  getFret?: FGetFret,
  layout?: GuitarNeckLayout
}

function GuitarNeck({
  highlightFret = () => false,
  getFret = ({ note }) => note instanceof Note ? note.SPN : FRET_MARKER,
}: GuitarNeckProps) {
  const { layout, tuning, fretNumber, containerRef } = useGuitarNeck();
  const strings: GuitarStringProps[] = tuning.strings.map((s) => ({
    tuning: s.note.SPN,
    highlightFret,
    getFret,
    fretNumber,
    stringNumber: s.order,
  }));
  const stringsInOrder = layout === "vertical" ? strings.reverse() : strings;

  return <>
    <Box py={4}>
      <GuitarTuning />
    </Box>
    <Grid
      ref={containerRef}
      templateColumns={layout === "vertical" ? `repeat(${tuning.strings.length + 1}, minmax(0, 1fr))` : undefined}
      templateRows={layout === "horizontal" ? `repeat(${tuning.strings.length + 1}, minmax(0, 1fr))` : undefined}
      position="relative"
      overflow="auto"
      maxWidth={layout === "vertical" ? 12 * tuning.strings.length : undefined}
    >
      {layout === "vertical" && <GuitarFretMarkerContainer />}
      {stringsInOrder.map((string) => <GuitarString key={`string-${string.stringNumber}`} {...string} />)}
      {layout === "horizontal" && <GuitarFretMarkerContainer />}
    </Grid>
  </>;
}

export default function GuitarNeckWithProvider(props: GuitarNeckProps) {
  return (
    <GuitarNeckProvider value={{ layout: props.layout }}>
      <GuitarNeck {...props} />
    </GuitarNeckProvider>
  );
}
