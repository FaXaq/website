import { Note, Scale } from "mtts"
import PianoKey, { PianoBlackKeyComponentProps, PianoKeyComponentProps } from "./PianoKey"

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
    return Note.fromSPN(domain[0].SPN).sharpenChromatically(i)
  })

  const whiteNotes = notesWithinDomainRange.filter(note => !note.hasAccidental())
  const blackNotes = notesWithinDomainRange.filter(note => note.hasAccidental())

  return (
    <div >
      <div >
        {whiteNotes.map(note => (
          <PianoKey
            key={`keys-key-${note.SPN}`}
            scale={scale}
            note={note}
            blackNote={blackNotes.find(blackNote => Note.getSemitonesBetween(note, blackNote) === 1)}
            PianoBlackKeyComponent={PianoBlackKeyComponent}
            PianoKeyComponent={PianoKeyComponent}
          />
        ))}
      </div>
    </div>
  )
}