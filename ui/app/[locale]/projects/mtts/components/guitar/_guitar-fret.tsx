'use client';

import { GridItem } from '@chakra-ui/react';
// eslint-disable-next-line no-unused-vars
import type { Note } from 'mtts';
import React from 'react';

import { FRET_MARKER } from './const';
import { useGuitarNeck } from './context';

export type FHighlight = ({ note, stringNumber, fretNumber }: { note: typeof FRET_MARKER | Note, stringNumber?: number, fretNumber?: number }) => boolean
export type FGetFret = ({ note, stringNumber, fretNumber, highlighted }: { note: typeof FRET_MARKER | Note, highlighted: boolean, stringNumber: number, fretNumber: number }) => React.JSX.Element | null | string

export interface GuitarFretProps {
  stringNumber: number,
  fretNumber: number,
  note: Note | typeof FRET_MARKER,
  highlight: FHighlight,
  getFret: FGetFret,
}

function GuitarFret({ note, stringNumber, fretNumber, highlight, getFret }: GuitarFretProps) {
  const highlighted = highlight({ note, stringNumber, fretNumber });
  const { layout, fretNumber: guitarFretNumber } = useGuitarNeck();

  const horizontalLayout = {
    borderBottom: fretNumber !== 0 && "1px solid",
    borderBottomColor: "fg.muted",
    borderLeft: (fretNumber !== 0 && note !== FRET_MARKER) && "1px solid",
    borderLeftColor: "fg.muted",
    borderRight: (note !== FRET_MARKER && fretNumber === guitarFretNumber - 1) && "1px solid",
    borderRightColor: "fg.muted",
    borderTop: (layout === "vertical" && fretNumber === 1) && "1px solid",
    borderTopColor: "fg.muted",
  };

  const verticalLayout = {
    borderBottom: note !== FRET_MARKER && fretNumber !== 0 && "1px solid",
    borderBottomColor: "fg.muted",
    borderLeft: fretNumber !== 0 && "1px solid",
    borderLeftColor: "fg.muted",
    borderTop: note !== FRET_MARKER && layout === "vertical" && fretNumber === 1 && "1px solid",
    borderTopColor: "fg.muted",
  };

  const fretBorders = layout === "vertical" ? verticalLayout : horizontalLayout;

  return <GridItem
    textAlign="center"
    {...fretBorders}
  >
    {getFret({ note, stringNumber, fretNumber, highlighted })}
  </GridItem>;
}

export default GuitarFret;
