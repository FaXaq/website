import React from 'react'
import { PianoKeyComponentProps } from "../../components/keys/PianoKey"
import { getNoteColor } from '../helpers/getNoteColor'
import { Box } from '@chakra-ui/react'
import { getColorString } from '../utils'

export default function PianoKey({ scale, note }: PianoKeyComponentProps) {
  const noteColor = getNoteColor(scale, note);
  return <Box bg={noteColor ? getColorString({ color: noteColor }) : "transparent" }></Box>
}