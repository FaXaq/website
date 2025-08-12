import classNames from "classnames"
import { Note, Scale } from "mtts"
import { COLOR, getNoteColor } from "../../scale-builder/helpers/getNoteColor"

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
    <div>
      {
        PianoKeyComponent !== undefined && <PianoKeyComponent scale={scale} note={note} />
      }
      {
        blackNote && (
          <div>
            { PianoBlackKeyComponent !== undefined && <PianoBlackKeyComponent scale={scale} note={blackNote} /> }
          </div>
        )
      }
    </div>
  )
}