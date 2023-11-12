import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import SquareButton from '../../../../components/square-button'
import { useTranslation } from 'next-i18next'
import GuitarNeck from '../../components/guitar/guitar-neck'
import Fret from './Fret'
import ColorButton from './ColorButton'
import { COLOR } from '../helpers/getNoteColor'
import { getNoteIntervalIndexInScale } from '../helpers/getNoteIndexInScale'
import { getNotationWithoutPitch } from '../helpers/getNotationWithoutPitch'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import Chord from './Chord'

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
        <p>Select your root note :</p>
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
        <div>
        {scale.scaleChords.length > 0 && (
            <>
              <p>Here are the diatonic chords I can identify within the scale :</p>
              <ul className='py-5'>
                {scale.scaleChords.map(chord =>
                  chord.notation && (
                    <li className="py-1" key={`${chord.root.name}${chord.notation}`}>
                      <Chord chord={chord} scale={scale} />
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className='flex flex-col col-span-2'>
        <p>Here is the scale on a guitar neck :</p>
        <div className='py-4'>
          <GuitarNeck
            layout='horizontal'
            highlightFret={({ note }) => noteExistsInScale(scale, note)}
            getFret={(props) =>
              <Fret
                {...props}
                scale={scale}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default BuildScale
