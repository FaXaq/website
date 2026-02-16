import { Box, Grid } from '@chakra-ui/react';
import type { Chord } from '@repo/mtts';
import React, { useEffect, useState } from 'react';

import type { FGetFret, FHighlight } from './_guitar-fret';
import { GuitarFretMarkerContainer } from './_guitar-fret-marker';
import type { GuitarStringProps } from './_guitar-string';
import GuitarString from './_guitar-string';
import type { GuitarNeckLayout } from './context';
import { GuitarNeckProvider, useGuitarNeck } from './context';
import { GuitarTuning } from './guitar-tuning';
import type { NotePosition } from './placements/utils';
import { findVoicings } from './placements/utils';
import type { ITuning } from './tunings';
import { VoicingSelector } from './voicing-selector';

export interface GuitarNeckProps {
  tuning?: ITuning,
  fretNumber?: number,
  highlightFret?: FHighlight,
  getFret?: FGetFret,
  layout?: GuitarNeckLayout,
  chord?: Chord
}

function GuitarNeck({
  highlightFret = () => false,
  getFret = ({ note }) => note.SPN,
  chord
}: GuitarNeckProps) {
  const { layout, tuning, fretNumber, containerRef, neckMatrix, setFocusedFrets } = useGuitarNeck();
  const [voicings, setVoicings] = useState<NotePosition[][]>([]);
  const [voicing, setVoicing] = useState<NotePosition[]>();

  const strings: GuitarStringProps[] = tuning.strings.map((s) => ({
    tuning: s.note.SPN,
    highlightFret,
    getFret,
    fretNumber,
    stringNumber: s.order,
  }));
  const stringsInOrder = layout === "vertical" ? strings.reverse() : strings;

  useEffect(() => {
    if (chord) {
      setVoicings(findVoicings(neckMatrix, chord));
    }
  }, [neckMatrix, chord]);

  useEffect(() => {
    if (voicing) {
      setFocusedFrets(voicing.map(({ fretIndex, stringIndex }) => ({ fretIndex, stringIndex })));
    }
  }, [voicing]);

  return <>
    <Box py={4}>
      <GuitarTuning />
    </Box>
    <VoicingSelector
      voicings={voicings ?? []}
      selectedVoicing={voicing}
      onVoicingChange={(voicing) => setVoicing(voicing)}
    />
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
