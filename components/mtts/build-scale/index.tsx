import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import SquareButton from '../../square-button'
import { useTranslation } from 'react-i18next'
import GuitarNeck from '../instruments/guitar/guitar-neck'
import Fret from './Fret'
import ColorButton, { COLOR } from './ColorButton'

const possibleAccidentals: Accidental[] =
  ACCIDENTALS
    .filter(a => !a.includes('DOUBLE'))
    .map(a => new Accidental({ semitones: ACCIDENTAL[a] }))

const possibleIntervals: {
  [key:number]: Interval[]
 } = (() => {
   const intervals: { [key:number]: Interval[] } = {}
   Object.keys(INTERVALS)
     .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
     .forEach(interval => {
       const intervalNumber = interval.replace(/[a-zA-Z]/, '')
       if (!intervals[intervalNumber]) {
         intervals[intervalNumber] = []
       }

       intervals[intervalNumber].push(Interval.fromName(interval))
     })
   return intervals
 })()

const INTERVAL_COLORS = Object.values(COLOR)

function getNotationWithoutPitch(note: Note): string {
  return note.SPN.replace(/[0-9]/, '')
}

function getNoteInScale(scale: Scale, note: Note): Note {
  return scale.notes.find(n => Note.getSemitonesBetween(note, n) % 12 === 0)
}

function noteExistsInScale(scale: Scale, note: Note | string): boolean {
  if (!(note instanceof Note)) return false
  return getNoteInScale(scale, note) !== undefined
}

/**
 * return interval index in scale from note name
 * ie: if the scale is C major and we give an E, it will return a 3, because E is the major 3rd of C
 */
function getNoteIntervalIndexInScale(scale: Scale, note: Note) {
  const index = scale.notes.findIndex(n => Note.getSemitonesBetween(note, n) % 12 === 0)
  if (index < 0) {
    return -1
  }
  return scale.intervals[index].value
}

const possibleNotes: Note[] = NOTES.map(n => new Note({ name: n }))

function BuildScale() {
  const [rootNote, setRootNote] = useState(possibleNotes[0])
  const [scale, setScale] = useState<Scale>(new Scale({ key: rootNote }))
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)

  function getIntervalIndexInScale(interval: Interval) {
    return scaleIntervals.findIndex(si => interval.name === si.name)
  }

  function toggleScaleInterval(interval: Interval) {
    const intervalIndexInScale = getIntervalIndexInScale(interval)
    if (intervalIndexInScale > -1) {
      setScaleIntervals(si => si.reduce((previous, current, interval) => {
        if (interval !== intervalIndexInScale) {
          return [...previous, current]
        }

        return [...previous]
      }, []))
    } else {
      setScaleIntervals(si => [...si, interval])
    }
  }

  useEffect(() => {
    try {
      setScale(new Scale({ key: rootNote, intervals: scaleIntervals }))
    } catch (err) {
      console.error(err)
    }
  }, [rootNote, scaleIntervals])

  const { t } = useTranslation()
  return (
    <div className='grid grid-cols-2 gap-4'>
      <div>
        <p>Select your note :</p>
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
        <p>Select if there is an accidental :</p>
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
        <p>Select your intervals</p>
        <ul className="flex flex-wrap">
          {Object.keys(possibleIntervals).map((intervalKey) =>
            <li key={intervalKey}>
              <ul>
                {possibleIntervals[intervalKey].map(interval => (
                  <li key={`${intervalKey}-${interval.name}`}>
                    <ColorButton
                      color={INTERVAL_COLORS[interval.value - 1]}
                      isActive={getIntervalIndexInScale(interval) > -1}
                      onClick={() => toggleScaleInterval(interval)}
                    >
                      <span>{interval.name}</span>
                    </ColorButton>
                  </li>))}
              </ul>
            </li>
          )
          }
        </ul>
      </div>
      <div>
        <p>Or select your scale directly here (might be out of sync if you chose custom intervals) :</p>
        <select value={scale.name.toUpperCase()} onChange={(e) => { setScaleIntervals(SCALES[e.target.value].intervals) }}>
          <option value={null}>Not implemented yet</option>
          {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p>Scale root : {getNotationWithoutPitch(rootNote)}</p>
        <p>Scale name : {scale.name}</p>
        { scale.mode && <p>Scale mode : {scale.mode}</p> }
        {scale.scaleChords.length > 0 && (
          <>
            <p>Here are the diatonic chords I can identify within the scale :</p>
            <ul className='py-5'>
              {scale.scaleChords.map(chord =>
                chord.notation && <li key={`${chord.root.name}${chord.notation}`}>
                  <p>
                    <span>{getNotationWithoutPitch(chord.root)}</span>
                    <span>{chord.notation} :</span>
                    <span>{chord.notes.map(note => ` ${getNotationWithoutPitch(note)}`)}</span>
                  </p>
                </li>
              )}
            </ul>
          </>
        )}
      </div>
      <div className='flex flex-col col-span-2'>
        <p>Here is the scale on a guitar neck :</p>
        <div className='py-4 self-center'>
          <GuitarNeck
            highlightFret={({ note }) => noteExistsInScale(scale, note)}
            getFret={(props) =>
              <Fret
                {...props}
                getNoteInScale={(note) => getNoteInScale(scale, note)}
                noteExistsInScale={(note) => noteExistsInScale(scale, note)}
                getNoteIntervalIndexInScale={(note) => getNoteIntervalIndexInScale(scale, note)}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default BuildScale
