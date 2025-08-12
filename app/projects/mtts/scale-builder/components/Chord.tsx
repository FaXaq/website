import classNames from "classnames"
import { Chord as MTTSChord, Scale } from "mtts"
import { getNotationWithoutPitch } from "../helpers/getNotationWithoutPitch"
import { COLOR, getNoteColor } from "../helpers/getNoteColor"
import { useNoteTranslation } from "../hooks/useNoteTranslation"

interface ChordProps {
    chord: MTTSChord,
    scale: Scale
}

export default function Chord({ chord, scale }: ChordProps) {
  const { translateNote } = useNoteTranslation()
  const chordNotation = translateNote(chord.root) + chord.notation

  return (
    <div >
      <p>
        <span>{chordNotation} :</span>
      </p>
      <ul >
        {chord.notes.map(note => (
          <li key={`chord-${chordNotation}-${note.SPN}`}>
            {translateNote(note)}
          </li>
        ))}
      </ul>
    </div>
  )
}