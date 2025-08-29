import classNames from "classnames"
import { Chord as MTTSChord, Scale } from "mtts"
import { getNotationWithoutPitch } from "../helpers/getNotationWithoutPitch"
import { COLOR, getNoteColor } from "../helpers/getNoteColor"
import { useNoteTranslation } from "../hooks/useNoteTranslation"
import { List } from "@chakra-ui/react"

interface ChordProps {
    chord: MTTSChord,
    scale: Scale
}

export default function Chord({ chord, scale }: ChordProps) {
  const { translateNote } = useNoteTranslation()
  const chordNotation = translateNote(chord.root) + chord.notation

  return (
    <div>
      <p>
        <span>{chordNotation} :</span>
      </p>
      <List.Root variant="plain" flexDir="row" gap={1}>
        {chord.notes.map(note => (
          <List.Item key={`chord-${chordNotation}-${note.SPN}`}>
            {translateNote(note)}
          </List.Item>
        ))}
      </List.Root>
    </div>
  )
}