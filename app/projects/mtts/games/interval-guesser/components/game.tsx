import React, { useEffect, useState, useCallback, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note, Interval } from 'mtts'
import IntervalGuesserButton from './button'
import { shuffleArray, getRandomEntities } from '../../../../../../utils/misc'
import * as Tone from 'tone'
// eslint-disable-next-line no-unused-vars
import { Level } from '../page'
import Oscillator from './oscillator'
import FFT from './fft'
import Knob from '../../../components/controls/knob'
import { useVolume, useFFT, useWaveform } from '../../../hooks/tonejs'
import { useTranslation } from 'next-i18next'
import { usePolysynth } from '../../../hooks/polysynth'

interface IntervalGuesserGameProps {
  note: Note;
  onWin: (...e: any) => any;
  onLoose: (...e: any) => any;
  level: Level;
  isPlaying: boolean;
}

const DEFAULT_VOLUME = -15

const IntervalGuesserGame = ({ note, level, onWin, onLoose, isPlaying }: IntervalGuesserGameProps) => {
  const { t } = useTranslation()
  const [playingSound, setPlayingSound] = useState(false)
  const { db, setDb } = useVolume(DEFAULT_VOLUME)
  const fft = useFFT()
  const waveform = useWaveform()
  const { polysynth, setVolume } = usePolysynth()
  const [randomIntervals, setRandomIntervals] = useState<Interval[]>(getRandomEntities(level.intervals))

  // Generate random interval
  useEffect(() => {
    if (isPlaying === true) {
      setRandomIntervals(getRandomEntities(level.intervals))
    }
  }, [isPlaying])

  // fill new intervals
  const remainingIntervals = useMemo(() => {
    return getRandomEntities(
      level.intervals.filter(i => randomIntervals.findIndex((ri: Interval) => ri.name === i.name) < 0),
      4
    )
  }, [randomIntervals])

  // Is the user right ?
  const compareToSecretInterval = useCallback((interval: Interval) => {
    if (randomIntervals.some(i => Interval.equals(i, interval))) {
      onWin()
    } else {
      onLoose()
    }
  }, [randomIntervals])

  // JSX Elements for intervals
  const displayIntervals = useMemo(() => shuffleArray(
    [
      ...randomIntervals,
      ...remainingIntervals
    ]
  ).map(i => (
    <li key={`interval-${i.name}`}>
      <IntervalGuesserButton onClick={() => compareToSecretInterval(i)} fixedSize={true}>
        <span>{i.name}</span>
      </IntervalGuesserButton>
    </li>
  )), [randomIntervals, remainingIntervals, compareToSecretInterval])

  // generate all notes from intervals to guess
  const notesToPlay = useMemo(() => [note, ...randomIntervals.map(i => i.apply(note))], [note, randomIntervals])

  // setting up the polysynth
  useEffect(() => {
    if (polysynth && waveform && fft) {
      polysynth.chain(waveform, fft)
      polysynth.set({
        envelope: {
          attack: 0.5,
          decay: 0.5,
          sustain: 0.9,
          release: 0.5,
          attackCurve: 'linear',
          decayCurve: 'linear',
          releaseCurve: 'linear'
        }
      })
    }
  }, [polysynth, waveform, fft])

  useEffect(() => {
    setVolume(db)
  }, [setVolume, db])

  // player handler
  useEffect(() => {
    if (polysynth !== undefined) {
      polysynth.triggerAttack(notesToPlay.map(n => n.frequency))
      setPlayingSound(true)
    }

    return () => {
      if (polysynth !== undefined) {
        polysynth.triggerRelease(notesToPlay.map(n => n.frequency))
        setPlayingSound(false)
      }
    }
  }, [polysynth, notesToPlay])

  /* release when parent is not playing anymore */
  useEffect(() => {
    if (!isPlaying && playingSound) {
      polysynth.triggerRelease(notesToPlay.map(n => n.frequency))
      setPlayingSound(false)
    }
  }, [isPlaying, playingSound, notesToPlay])

  return (
    <div >
      { /* oscillator */}
      <div >
        <Oscillator waveform={waveform} />
        <FFT fft={fft} />
      </div>
      <ul >
        {displayIntervals}
      </ul>
      <Knob onUpdate={setDb} value={db} min={-100} max={0} label={t('mtts.controls.volume.title')} />
    </div>
  )
}

export default IntervalGuesserGame
