import { Box } from '@chakra-ui/react';

import type { PianoKeyComponentProps } from "@/components/mtts/keys/PianoKey";

import { getNoteColor } from './helpers/getNoteColor';
import { getColorString } from './utils';

export default function PianoKey({ scale, note }: PianoKeyComponentProps) {
  const noteColor = getNoteColor(scale, note);
  return <Box bg={noteColor ? getColorString({ color: noteColor }) : "transparent" } h="full" w="full" position="absolute" top="0" left="0"></Box>;
}