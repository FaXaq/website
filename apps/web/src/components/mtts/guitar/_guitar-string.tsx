import { Grid } from '@chakra-ui/react';
import { Note } from '@repo/mtts';

import type { FGetFret, FHighlight, GuitarFretProps } from './_guitar-fret';
import GuitarFret from './_guitar-fret';
import { useGuitarNeck } from './context';

export interface GuitarStringProps {
  tuning: string,
  stringNumber: number,
  fretNumber?: number,
  highlightFret: FHighlight,
  getFret: FGetFret,
}

function GuitarString({ tuning, fretNumber = 21, highlightFret, getFret, stringNumber }: GuitarStringProps) {
  const { layout } = useGuitarNeck();

  const frets: GuitarFretProps[] = [{
    note: Note.fromSPN(tuning),
    stringNumber,
    fretNumber: 0,
    highlight: highlightFret,
    getFret: getFret
  }];

  for (let i = 1; i < fretNumber; i++) {
    frets.push({
      note: Note.fromSPN(tuning).sharpenChromatically(i),
      highlight: highlightFret,
      getFret: getFret,
      stringNumber,
      fretNumber: i
    });
  }

  return <Grid
    templateColumns={layout === "horizontal" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
    templateRows={layout === "vertical" ? `repeat(${fretNumber}, minmax(0, 1fr))` : undefined}
  >
    {frets.map((fret, i) => <GuitarFret key={`string-${stringNumber}-fret-${i}`} {...fret} />)}
  </Grid>;
}

export default GuitarString;
