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
  console.log(system.token("sizes.2"))
  return (
    <Box textAlign="center" h="full" bg="gray.50" position="relative" w={8} roundedBottom="md" border="1px solid" borderColor="fg">
      {
        PianoKeyComponent !== undefined && <PianoKeyComponent scale={scale} note={note} />
      }
      {
        blackNote && (
          <Box position="absolute" bg="gray.950" h="50%" w="full" transform={`translateX(${system.token("sizes.4.5")})`} zIndex="10" roundedBottom="md" overflow="hidden" border="1px solid" borderColor="fg.inverted">
            { PianoBlackKeyComponent !== undefined && <PianoBlackKeyComponent scale={scale} note={blackNote} /> }
          </Box>
        )
      }
    </Box>
  )
}