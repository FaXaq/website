import classNames from "classnames"
import { Note, Scale } from "mtts"
import { COLOR, getNoteColor } from "../../scale-builder/helpers/getNoteColor"
import { Box } from "@chakra-ui/react"
import { system } from "@chakra-ui/react/preset"

export interface PianoBlackKeyComponentProps {
  note: Note,
  scale: Scale,
}

export interface PianoKeyComponentProps {
  note: Note,
  scale: Scale
}

interface PianoKeyProps {
  note: Note,
  scale: Scale,
  blackNote?: Note | undefined,
  PianoBlackKeyComponent?: React.FunctionComponent<PianoBlackKeyComponentProps>,
  PianoKeyComponent?: React.FunctionComponent<PianoKeyComponentProps>
}

export default function PianoKey({ note, scale, blackNote, PianoBlackKeyComponent, PianoKeyComponent }: PianoKeyProps) {
  return (
    <Box textAlign="center" h="full" bg="gray.50" position="relative" w={8} border="1px solid" borderColor="fg.subtle">
      {
        PianoKeyComponent !== undefined && <PianoKeyComponent scale={scale} note={note} />
      }
      {
        blackNote && (
          <Box position="absolute" bg="gray.950" h="50%" zIndex="10" w="full" transform={"translateX(50%)"} roundedBottom="md" overflow="hidden">
            { PianoBlackKeyComponent !== undefined && <PianoBlackKeyComponent scale={scale} note={blackNote} /> }
          </Box>
        )
      }
    </Box>
  )
}