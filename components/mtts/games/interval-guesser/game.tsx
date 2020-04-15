import React, { useEffect, useState, useCallback, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { Note, Interval } from 'mtts'
import IntervalGuesserButton from './button'
import { shuffleArray, getRandomEntities } from '../../../../utils/misc'
import { PolySynth, Synth } from 'tone'
// eslint-disable-next-line no-unused-vars
import { Level } from '../../../../pages/mtts/games/interval-guesser'
import IntervalGuesserOscillator from './oscillator'

interface IntervalGuesserGameProps {
  note: Note;
  onWin: (...e: any) => any;
  onLoose: (...e: any) => any;
  level: Level;
  isPlaying: boolean;
}

const LOW_VOLUME = -30
const HIGH_VOLUME = -10

const IntervalGuesserGame = ({ note, level, onWin, onLoose, isPlaying }: IntervalGuesserGameProps) => {
  const [playingSound, setPlayingSound] = useState(false)
  const [highVolume, setHighVolume] = useState(false)
  const [polysynth, setPolysynth] = useState<PolySynth | undefined>()
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
    setPolysynth(new PolySynth(2, Synth).toMaster())
  }, [])

  // setting up the polysynth
  useEffect(() => {
    if (polysynth !== undefined) {
      polysynth.set({
        volume: LOW_VOLUME,
        detune: -1200,
        envelope: {
          attack: 0.5,
          decay: 0.5,
          sustain: 0.9,
          release: 0.9,
          attackCurve: 'linear',
          decayCurve: 'linear',
          releaseCurve: 'linear'
        }
      })
    }
  }, [polysynth])

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

  // allow user to toggle volume of the interval playing
  const toggleVolume = useCallback(() => {
    if (polysynth !== undefined) {
      const currentVolume = polysynth.get('volume').volume
      if (currentVolume as number < HIGH_VOLUME) {
        polysynth.set('volume', HIGH_VOLUME)
        setHighVolume(true)
      } else {
        polysynth.set('volume', LOW_VOLUME)
        setHighVolume(false)
      }
    }
  }, [polysynth])

  const oscillator = useMemo(() => (
    <IntervalGuesserOscillator
      frequencies={ notesToPlay.map(n => n.frequency) }
      highAmplitude={ highVolume }
      onClick={() => toggleVolume()}
      animated={ playingSound }
    />
  ), [notesToPlay, highVolume, playingSound])

  return (
    <div>
      {oscillator}
      <ul className="flex justify-center flex-wrap">
        {displayIntervals}
      </ul>
    </div>
  )
}

export default IntervalGuesserGame
