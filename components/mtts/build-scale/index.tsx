import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES, Chord } from 'mtts'
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

function BuildScale() {
  const [rootNote, setRootNote] = useState(possibleNotes[0])
  const [scale, setScale] = useState<Scale>(new Scale({ key: rootNote }))
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([])

  const chord = selectedNotes.length > 0 ? new Chord({
    root: selectedNotes[0],
    notes: selectedNotes
  }) : undefined

  function getIntervalIndexInScale(interval: Interval) {
    return scaleIntervals.findIndex(si => interval.name === si.name)
  }

  function toggleScaleInterval(interval: Interval) {
    const intervalIndexInScale = getIntervalIndexInScale(interval)
    if (intervalIndexInScale > -1) {
      setScaleIntervals(si => si.reduce((p, c, i) => i !== intervalIndexInScale ? [...p, c] : [...p], []))
    } else {
      setScaleIntervals(si => [...si, interval])
    }
  }

  function getSelectNoteIndex(note: Note) {
    return selectedNotes.findIndex(sn => note.SPN === sn.SPN)
  }

  function toggleSelectedNote(note: Note) {
    const selecteNoteIndex = getSelectNoteIndex(note)
    if (selecteNoteIndex > -1) {
      setSelectedNotes(sn => sn.reduce((p, c, i) => i !== selecteNoteIndex ? [...p, c] : [...p], []))
    } else {
      setSelectedNotes(sn => [...sn, note].sort((a, b) => a.frequency - b.frequency))
    }
  }

  useEffect(() => {
    setScale(new Scale({ key: rootNote, intervals: scaleIntervals }))
  }, [rootNote, scaleIntervals])

  const { t } = useTranslation()
  return (
    <div>
      <ul className="flex flex-wrap">
        {possibleNotes.map(n =>
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
        {possibleAccidentals.map(a =>
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
        {possibleIntervals.map(i =>
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
      <p>Scale name : {scale.name}</p>
      <p>Scale mode : {scale.mode}</p>
      <select onChange={(e) => { setScaleIntervals(SCALES[e.target.value].intervals) }}>
        {Object.keys(SCALES).map(s => <option key={s}>{s}</option>)}
      </select>
      <ul>
        {scale.notes.map(n => (
          <li key={n.name}>
            <SquareButton
              text={t(`mtts.notes.${n.name}`) + (n.hasAccidental() ? t(`mtts.accidentals.${n.accidental.name}`) : '')}
              isActive={getSelectNoteIndex(n) > -1}
              onClick={() => toggleSelectedNote(n)}
            />
          </li>
        ))}
      </ul>
      {chord ? <p>
        <span>{t(`mtts.notes.${chord.root.name}`)}</span>
        <span>{chord.notation}</span>
      </p> : null}
    </div>
  )
}

export default BuildScale
