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
    <div className={classNames({
      'text-center flex align-items border rounded-bl rounded-br grow relative border-mtts-dark-violet-200': true,
    })}>
      {
        PianoKeyComponent !== undefined && <PianoKeyComponent scale={scale} note={note} />
      }
      {
        blackNote && (
          <div className={classNames({
            'absolute w-1/2 h-1/2 translate-x-3/2 z-10 rounded-bl rounded-br border border-mtts-dark-violet-200 bg-mtts-dark-violet': true,
          })}>
            { PianoBlackKeyComponent !== undefined && <PianoBlackKeyComponent scale={scale} note={blackNote} /> }
          </div>
        )
      }
    </div>
  )
}