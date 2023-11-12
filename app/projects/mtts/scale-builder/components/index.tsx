import React, { useState, useEffect } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import SquareButton from '../../../../components/square-button'
import { useTranslation } from 'next-i18next'
import GuitarNeck from '../../components/guitar/guitar-neck'
import Fret from './Fret'
import ColorButton from './ColorButton'
import { COLOR } from '../helpers/getNoteColor'
import { getNotationWithoutPitch } from '../helpers/getNotationWithoutPitch'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import Chord from './Chord'
import { useNoteTranslation } from '../hooks/useNoteTranslation'

const availableAccidentals: Accidental[] =
  ACCIDENTALS
    .filter(a => !a.includes('DOUBLE'))
    .map(a => new Accidental({ semitones: ACCIDENTAL[a] }))

const availableIntervals: {
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


const availableNotes: Note[] = NOTES.map(n => new Note({ name: n }))
const availableRootNotes: Note[] = []
availableNotes
  .forEach(note => {
    availableAccidentals
      .forEach(accidental => {
        availableRootNotes.push(new Note({
          name: note.name,
          accidental: new Accidental({ semitones: accidental.semitones })
        }))
      })
  })

function BuildScale() {
  const [rootNote, setRootNote] = useState<Note>(availableNotes[0])
  const [scale, setScale] = useState<Scale>(new Scale({ key: rootNote }))
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)
  const { translateNote } = useNoteTranslation()

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

  const scaleTitle = `${translateNote(rootNote)} ${scale.name || scale.mode ? scale.name : `(${scale.intervals.map(interval => `${interval.name}`)})`} ${scale.mode && `/ ${translateNote(rootNote)} ${scale.mode}`}`

  return (
    <div>

      <header className="pb-4">
        <h1 className="font-mtts-title text-4xl font-bold">Scale Builder - {scaleTitle}</h1>
      </header>
      <div className='grid grid-cols-2 gap-4'>
        <div className="flex flex-col">
          <div className="flex">
            <p>Select your root note :</p>
            <select
              className="ml-2 rounded inline-block h-auto"
              value={availableRootNotes.findIndex((note: Note) => rootNote.SPN === note.SPN)}
              onChange={(e) => setRootNote(availableRootNotes[e.target.value])}
            >
              {availableRootNotes.map((note, index) => (
                <option value={index} key={note.name}>
                  {translateNote(note)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-start items-center">
              <p>Select intervals for your scale :</p>
              <select className="ml-2" value={scale.name.toUpperCase()} onChange={(e) => { setScaleIntervals(SCALES[e.target.value].intervals) }}>
                <option value={null}>Not implemented yet</option>
                {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <ul className="pt-4 flex flex-wrap">
              {Object.keys(availableIntervals).map((intervalKey) =>
                <li key={intervalKey}>
                  <ul>
                    {availableIntervals[intervalKey].map(interval => (
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
        </div>
        <div>
          <p>Scale notes :</p>
          <ul className='flex'>
            {scale.notes.map(note => (
              <li className="pr-2 pb-2" key={`${note.SPN}`}>{translateNote(note)}</li>
            ))}
          </ul>
          {scale.scaleChords.length > 0 && (
            <ul>
              {scale.scaleChords.map(chord =>
                chord.notation && (
                  <li className="py-1" key={`${chord.root.name}${chord.notation}`}>
                    <Chord chord={chord} scale={scale} />
                  </li>
                )
              )}
            </ul>
          )}
        </div>
        <div className='col-span-2 flex flex-col'>
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
    </div>
  )
}

export default BuildScale
