import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES, Chord } from 'mtts'
import SquareButton from '../../square-button'
import { useTranslation } from 'react-i18next'
import GuitarNeck from '../instruments/guitar/guitar-neck'

const possibleAccidentals: Accidental[] =
  ACCIDENTALS
    .filter(a => !a.includes('DOUBLE'))
    .map(a => new Accidental({ semitones: ACCIDENTAL[a] }))

const possibleIntervals: Interval[] =
  Object.keys(INTERVALS)
    .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
    .map(i => Interval.fromName(i))

function getNoteInScale(scale: Scale, note: Note): Note {
  return scale.notes.find(n => Note.getSemitonesBetween(note, n) % 12 === 0)
}

function noteExistsInScale(scale: Scale, note: Note): boolean {
  return getNoteInScale(scale, note) !== undefined
}

function getNoteNameWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/g, '')
}

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
    try {
      setScale(new Scale({ key: rootNote, intervals: scaleIntervals }))
    } catch (err) {
      console.error(err)
    }
  }, [rootNote, scaleIntervals])

  console.log(scale)

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
      <GuitarNeck
        highlightFret={({ note }) => noteExistsInScale(scale, note)}
        getFret={({ note }) => noteExistsInScale(scale, note) ? <p>{ getNoteNameWithoutPitch(getNoteInScale(scale, note)) }</p> : <p></p>}
      />
      <ul className='flex'>
        {scale.notes.map(n => (
          <li key={n.SPN}>
            <SquareButton
              text={t(`mtts.notes.${n.name}`) + (n.accidental.semitones !== 0 ? t(`mtts.accidentals.${n.accidental.name}`) : '')}
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
