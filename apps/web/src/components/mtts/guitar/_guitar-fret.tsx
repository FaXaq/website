import { Box, GridItem } from '@chakra-ui/react';
import type { Note } from '@repo/mtts';
import React from 'react';

import { useGuitarNeck } from './context';

export type FHighlight = (params: {
  note: Note,
  stringNumber?: number,
  fretNumber?: number
}) => boolean

export type FGetFret = (params: {
  note: Note,
  highlighted: boolean,
  stringNumber: number,
  fretNumber: number
}) => React.JSX.Element | null | string

export interface GuitarFretProps {
  stringNumber: number,
  fretNumber: number,
  note: Note,
  highlight: FHighlight,
  getFret: FGetFret,
}

function GuitarFret({ note, stringNumber, fretNumber, highlight, getFret }: GuitarFretProps) {
  const highlighted = highlight({ note, stringNumber, fretNumber });
  const { layout } = useGuitarNeck();

  return <GridItem
    textAlign="center"
    borderColor="gray.focusRing"
    borderStyle="solid"
    borderBottomWidth={layout === "vertical" ? 1 : undefined}
    borderRightWidth={layout === "horizontal" ? 1 : undefined}
    zIndex={10}
    position="relative"
  >
    {layout === "horizontal" && fretNumber !== 0 && <Box h={0.5} w="full" bg="gray.emphasized" position="absolute" top="50%" zIndex={1}></Box>}
    {layout === "vertical" && fretNumber !== 0 && <Box w={0.5} h="full" bg="gray.emphasized" position="absolute" left="50%" zIndex={1}></Box>}
    <Box position="relative" zIndex={10} height="full" width="full">
      {getFret({ note, stringNumber, fretNumber, highlighted })}
    </Box>
  </GridItem>;
}

export default GuitarFret;
