import React from 'react'
import { PianoBlackKeyComponentProps } from "../../components/keys/PianoKey"
import { getNoteColor } from '../helpers/getNoteColor'
import { Box } from '@chakra-ui/react'
import { getColorString } from '../utils'

export default function PianoBlackKey({ scale, note }: PianoBlackKeyComponentProps) {
  const noteColor = getNoteColor(scale, note);
  return <Box h="full" w="full" bg={noteColor ? getColorString({ color: noteColor }) : "transparent" }></Box>
}