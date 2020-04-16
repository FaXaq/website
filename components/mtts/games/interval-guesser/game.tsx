import React, { useEffect, useState, useCallback, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note, Interval } from 'mtts'
import IntervalGuesserButton from './button'
import { shuffleArray, getRandomEntities } from '../../../../utils/misc'
import * as Tone from 'tone'
// eslint-disable-next-line no-unused-vars
import { Level } from '../../../../pages/mtts/games/interval-guesser'
import Oscillator from './oscillator'
import FFT from './fft'
import Dial from '../../controls/dial'

interface IntervalGuesserGameProps {
  note: Note;
  onWin: (...e: any) => any;
  onLoose: (...e: any) => any;
  level: Level;
  isPlaying: boolean;
}

const IntervalGuesserGame = ({ note, level, onWin, onLoose, isPlaying }: IntervalGuesserGameProps) => {
  const [playingSound, setPlayingSound] = useState(false)
  const [volume, setVolume] = useState<Tone.Volume | undefined>()
  const [decibels, setDecibels] = useState<number>(-10)
  const [fft, setFFT] = useState<Tone.FFT | undefined>()
  const [waveform, setWaveform] = useState<Tone.Waveform | undefined>()
  const [polysynth, setPolysynth] = useState<Tone.PolySynth | undefined>()
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
      <IntervalGuesserButton onClick={() => compareToSecretInterval(i) }>
        <span>{i.name}</span>
      </IntervalGuesserButton>
    </li>
  )), [randomIntervals, remainingIntervals, compareToSecretInterval])

  // generate all notes from intervals to guess
  const notesToPlay = useMemo(() => [note, ...randomIntervals.map(i => i.apply(note))], [note, randomIntervals])

  // create the polysynth
  useEffect(() => {
    setPolysynth(new Tone.PolySynth(2, Tone.Synth))
    setVolume(new Tone.Volume(decibels))
    setWaveform(new Tone.Waveform(256))
    setFFT(new Tone.FFT(256))

    return () => {
      console.log('disposing')
      polysynth.dispose()
      volume.dispose()
      fft.dispose()
      waveform.dispose()
    }
  }, [])

  // setting up the polysynth
  useEffect(() => {
    if (polysynth && volume && waveform && fft) {
      console.log(volume)
      polysynth.chain(volume, waveform, fft, Tone.Master)
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
  }, [polysynth, volume, waveform, fft])

  const updateVolume = useCallback((db: number) => {
    if (volume) {
      volume.volume.value = db
      setDecibels(db)
    } else {
      console.log('no volume')
    }
  }, [volume])

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

  useEffect(() => {
    if (!isPlaying && playingSound) {
      polysynth.triggerRelease(notesToPlay.map(n => n.frequency))
      setPlayingSound(false)
    }
  }, [isPlaying, playingSound, notesToPlay])

  return (
    <div>
      { /* oscillator */ }
      <Oscillator waveform={waveform} />
      <FFT fft={fft} />
      <ul className="flex justify-center flex-wrap">
        {displayIntervals}
      </ul>
      <Dial onUpdate={updateVolume} value={decibels} min={-100} max={10} />
    </div>
  )
}

export default IntervalGuesserGame
