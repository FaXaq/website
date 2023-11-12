'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Note, NOTES, ACCIDENTALS, Accidental, INTERVALS, Interval, ACCIDENTAL, Scale, SCALES } from 'mtts'
import GuitarNeck from '../../components/guitar/guitar-neck'
import Fret from './Fret'
import ColorButton from './ColorButton'
import { COLOR } from '../helpers/getNoteColor'
import { noteExistsInScale } from '../helpers/noteExistsInScale'
import Chord from './Chord'
import { useNoteTranslation } from '../hooks/useNoteTranslation'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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

const ROOT_NOTE_SEARCH_PARAMS_KEY = 'rootNote'
const SCALE_INTERVALS_SEARCH_PARAMS_KEY = 'intervals'

function BuildScale() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [rootNote, setRootNote] = useState<Note>(availableRootNotes[0])
  const [scaleIntervals, setScaleIntervals] = useState<Interval[]>(SCALES.MAJOR.intervals)
  const { translateNote } = useNoteTranslation()

  const scale = useMemo(() => {
    try {
      return new Scale({ key: rootNote, intervals: scaleIntervals })
    } catch (err) {
      console.log(err)
    }
  }, [rootNote, scaleIntervals])

  const availableIntervals: {
    [key:number]: Interval[]
   } = useMemo(() => {
     const intervals: { [key:number]: Interval[] } = {}
     Object.keys(INTERVALS)
       .filter(i => INTERVALS[i].semitones < 12 && INTERVALS[i].value < 8)
       .forEach(interval => {
         const intervalNumber = interval.replace(/[a-zA-Z]/, '')
         if (!intervals[intervalNumber]) {
           intervals[intervalNumber] = []
         }

         try {
           Interval.apply(rootNote, interval)
           intervals[intervalNumber].push(Interval.fromName(interval))
         } catch (err) {}
       })
     return intervals
   }, [rootNote])

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
    const searchParamsRootNote = searchParams.get(ROOT_NOTE_SEARCH_PARAMS_KEY);
    const searchParamsScaleIntervals = searchParams.get(SCALE_INTERVALS_SEARCH_PARAMS_KEY)?.split(',');
    setRootNote(searchParamsRootNote ? Note.fromSPN(searchParamsRootNote) : availableRootNotes[0])
    setScaleIntervals(searchParamsScaleIntervals ? searchParamsScaleIntervals.map(interval => Interval.fromName(interval)) : SCALES.MAJOR.intervals)
  }, [])

  const scaleTitle = useMemo(() => {
    if (rootNote && scale) {
      return `${translateNote(rootNote)} ${scale.name || scale.mode ? scale.name : `(${scale.intervals.map(interval => `${interval.name}`)})`} ${scale.mode && `/ ${translateNote(rootNote)} ${scale.mode}`}`
    }
  }, [scale, rootNote])
  
  useEffect(() => {
    const newSearchParams = new URLSearchParams({
      [ROOT_NOTE_SEARCH_PARAMS_KEY]: rootNote.SPN,
      [SCALE_INTERVALS_SEARCH_PARAMS_KEY]: scaleIntervals.map(interval => interval.name).join(',')
    })

    router.push(pathname + '?' + newSearchParams.toString())
  }, [scaleIntervals, rootNote])

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
                <option value={index} key={translateNote(note)}>
                  {translateNote(note)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-start items-center">
              <p>Select intervals for your scale :</p>
              <select className="ml-2" value={scale?.name.toUpperCase()} onChange={(e) => { setScaleIntervals(SCALES[e.target.value].intervals) }}>
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
            <>
              <p>Scale chords :</p>
              <ul>
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
