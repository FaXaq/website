import classNames from "classnames"
import { Chord as MTTSChord, Scale } from "mtts"
import { getNotationWithoutPitch } from "../helpers/getNotationWithoutPitch"
import { COLOR, getNoteColor } from "../helpers/getNoteColor"

interface ChordProps {
    chord: MTTSChord,
    scale: Scale
}

export default function Chord({ chord, scale }: ChordProps) {
    const chordNotation = getNotationWithoutPitch(chord.root) + chord.notation

    return (
    <div className="flex">
        <p>
            <span>{chordNotation} :</span>
        </p>
        <ul className="flex pl-2">
            {chord.notes.map(note => (
                <li
                  className={classNames({
                    'px-2 self-center py-1 mx-1 rounded text-mtts-white text-center text-xs': true,
                    'bg-mtts-cta-0': getNoteColor(scale, note) === COLOR.DEFAULT,
                    'bg-mtts-yellow': getNoteColor(scale, note) === COLOR.YELLOW,
                    'bg-mtts-khaki': getNoteColor(scale, note) === COLOR.KHAKI,
                    'bg-mtts-green': getNoteColor(scale, note) === COLOR.GREEN,
                    'bg-mtts-blue': getNoteColor(scale, note) === COLOR.BLUE,
                    'bg-mtts-violet': getNoteColor(scale, note) === COLOR.VIOLET,
                    'bg-mtts-red': getNoteColor(scale, note) === COLOR.RED,
                  })}
                  key={`chord-${chordNotation}-${note.SPN}`}
                >
                  {getNotationWithoutPitch(note)}
                </li>
            ))}
        </ul>
    </div>
    )
}