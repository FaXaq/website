import { Em, Text } from "@chakra-ui/react";
import type { Chord as MTTSChord, Scale } from "@repo/mtts";

import { useNoteTranslation } from "../hooks/useNoteTranslation";

interface ChordProps {
    chord: MTTSChord,
    scale: Scale
}

export default function Chord({ chord, scale }: ChordProps) {
  const { translateNote } = useNoteTranslation();
  const chordNotation = translateNote(chord.root) + chord.notation;

  return (
    <Text>{chordNotation} : <Em>{chord.notes.map(note => translateNote(note)).join(", ")}</Em></Text>
  );
}