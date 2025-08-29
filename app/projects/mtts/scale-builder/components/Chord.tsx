import classNames from "classnames"
import { Chord as MTTSChord, Scale } from "mtts"
import { getNotationWithoutPitch } from "../helpers/getNotationWithoutPitch"
import { COLOR, getNoteColor } from "../helpers/getNoteColor"
import { useNoteTranslation } from "../hooks/useNoteTranslation"
import { Box, Em, HStack, List, Text } from "@chakra-ui/react"

interface ChordProps {
    chord: MTTSChord,
    scale: Scale
}

export default function Chord({ chord, scale }: ChordProps) {
  const { translateNote } = useNoteTranslation()
  const chordNotation = translateNote(chord.root) + chord.notation

  return (
    <Text>{chordNotation} : <Em>{chord.notes.map(note => translateNote(note)).join(", ")}</Em></Text>
  )
}