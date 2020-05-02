import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import SquareButton from '../../square-button'
import { useTranslation } from 'react-i18next'

const possibleAccidentals: Accidental[] =
ACCIDENTALS
  .filter(a => !a.includes('DOUBLE'))
  .map(a => new Accidental({ semitones: ACCIDENTAL[a] }))

const possibleIntervals: Interval[] =
Object.keys(INTERVALS)
  .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
  .map(i => Interval.fromName(i))

const possibleNotes: Note[] = NOTES.map(n => new Note({ name: n }))

function BuildScale () {
  const [rootNote, setRootNote] = useState(possibleNotes[0])
  const [scale, setScale] = useState<Scale>(new Scale({ key: rootNote }))
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)

  function getIntervalIndexInScale (interval: Interval) {
    return scaleIntervals.findIndex(si => interval.name === si.name)
  }

  function toggleScaleInterval (interval: Interval) {
    const intervalIndexInScale = getIntervalIndexInScale(interval)
    if (intervalIndexInScale > -1) {
      setScaleIntervals(si => si.reduce((p, c, i) => i !== intervalIndexInScale ? [...p, c] : [...p], []))
    } else {
      setScaleIntervals(si => [...si, interval])
    }
  }

  useEffect(() => {
    setScale(new Scale({ key: rootNote, intervals: scaleIntervals }))
  }, [rootNote, scaleIntervals])

  const { t } = useTranslation()
  return (
    <div>
      <ul className="flex flex-wrap">
        { possibleNotes.map(n =>
          <li key={n.name}>
            <SquareButton
              text={t(`mtts.notes.${n.name}`)}
              isActive={rootNote.name === n.name}
              onClick={() => setRootNote(n)}
            />
          </li>
        )
        }
      </ul>
      <ul className="flex flex-wrap">
        { possibleAccidentals.map(a =>
          <li key={a.name}>
            <SquareButton
              text={t(`mtts.accidentals.${a.name}`)}
              isActive={rootNote.hasAccidental() ? rootNote.accidental.semitones === a.semitones : a.semitones === 0}
              onClick={() => setRootNote(new Note({ name: rootNote.name, accidental: a }))}
            />
          </li>
        )
        }
      </ul>
      <ul className="flex flex-wrap">
        { possibleIntervals.map(i =>
          <li key={i.name}>
            <SquareButton
              text={i.name}
              isActive={getIntervalIndexInScale(i) > -1}
              onClick={() => toggleScaleInterval(i)}
            />
          </li>
        )
        }
      </ul>
      <p>{rootNote.SPN}</p>
      <p>Scale notes : {scale.notes.sort((n1, n2) => n1.frequency - n2.frequency).map(n => <span key={`note-${n.SPN}`}>{n.SPN} /</span>)}</p>
      <p>Scale name : {scale.name}</p>
      <p>Scale name : {scale.mode}</p>
      <select onChange={(e) => { setScaleIntervals(SCALES[e.target.value].intervals) }}>
        { Object.keys(SCALES).map(s => <option key={s}>{s}</option>)}
      </select>
      <ul>
        { scale.scaleChords.map((sc, i) => <li key={`chord-${i}`}>{sc.notes.map(n => n.SPN)} {sc.notation}</li>) }
      </ul>
    </div>
  )
}

export default BuildScale
