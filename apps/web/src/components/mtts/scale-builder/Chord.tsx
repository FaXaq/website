import { Box, Span, Text } from "@chakra-ui/react";
import type { Chord as MTTSChord, Scale } from "@repo/mtts";

import { useNoteTranslation } from "./hooks/useNoteTranslation";

interface ChordProps {
  chord: MTTSChord,
  degree?: string,
  scale: Scale,
  onClick?: (chord: MTTSChord) => void,
  highlighted?: boolean,
}

export default function Chord({ chord, degree, onClick, highlighted }: ChordProps) {
  const { translateNote } = useNoteTranslation();
  const chordNotation = translateNote(chord.root) + chord.notation;

  return (
    <Box
      border="1px solid"
      p={2}
      rounded="md"
      cursor="pointer"
      onClick={() => onClick && onClick(chord)}
      bg={highlighted ? "bg.inverted" : "bg.subtle"}
      color={highlighted ? "fg.inverted" : "fg.subtle"}
    >
      <Text>{degree ? <><Span fontSize="lg" pr={0.5}>{degree}</Span> : <Span>{chordNotation}</Span></> : chordNotation}</Text>
    </Box>
  );
}
