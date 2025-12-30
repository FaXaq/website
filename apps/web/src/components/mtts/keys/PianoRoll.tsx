import { Box, HStack } from "@chakra-ui/react";
import { Scale } from "@repo/mtts";
import { Note } from "@repo/mtts";

import type { PianoBlackKeyComponentProps, PianoKeyComponentProps } from "./PianoKey";
import PianoKey from "./PianoKey";

interface PianoRollProps {
  domain?: [Note, Note],
  scale?: Scale,
  PianoBlackKeyComponent?: React.FunctionComponent<PianoBlackKeyComponentProps>,
  PianoKeyComponent?: React.FunctionComponent<PianoKeyComponentProps>
}

export default function PianoRoll({
  domain = [Note.fromSPN('A0'), Note.fromSPN('C5')],
  scale,
  PianoBlackKeyComponent,
  PianoKeyComponent
}: PianoRollProps) {
  const notesWithinDomainRange = Array.from(Array(Note.getSemitonesBetween(domain[0], domain[1])).keys()).map((i) => {
    return Note.fromSPN(domain[0].SPN).sharpenChromatically(i);
  });

  const whiteNotes = notesWithinDomainRange.filter(note => !note.hasAccidental());
  const blackNotes = notesWithinDomainRange.filter(note => note.hasAccidental());

  return (
    <Box h="full" w="full">
      <HStack w="full" h="full" gap={0}>
        {whiteNotes.map(note => (
          <PianoKey
            key={`keys-key-${note.SPN}`}
            scale={scale ?? new Scale()}
            note={note}
            blackNote={blackNotes.find(blackNote => Note.getSemitonesBetween(note, blackNote) === 1)}
            PianoBlackKeyComponent={PianoBlackKeyComponent}
            PianoKeyComponent={PianoKeyComponent}
          />
        ))}
      </HStack>
    </Box>
  );
}