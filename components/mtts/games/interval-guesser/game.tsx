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
const HIGH_VOLUME = -15

const IntervalGuesserGame = ({ note, level, onWin, onLoose, isPlaying }: IntervalGuesserGameProps) => {
  const [playingSound, setPlayingSound] = useState(false)
  const [highVolume, setHighVolume] = useState(false)
  const [polysynth, setPolysynth] = useState<PolySynth | undefined>()

  // Generate random interval
  const randomIntervals = useMemo(() => getRandomEntities(level.intervals), [note])
  // Gather 4 wrong random intervals
  const remainingIntervals = useMemo(() => getRandomEntities(
    level.intervals.filter(i => randomIntervals.findIndex((ri: Interval) => ri.name === i.name) < 0),
    4
  ), [note])

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
  )), [note])

  // generate all notes from intervals to guess
  const notesToPlay = useMemo(() => [note, ...randomIntervals.map(i => i.apply(note))], [note, randomIntervals])

  // create the polysynth
  useEffect(() => {
    setPolysynth(new PolySynth(2, Synth).toMaster())
  }, [])

  useEffect(() => {
    if (polysynth !== undefined) {
      polysynth.set('volume', LOW_VOLUME)
      polysynth.set('detune', -1200)
    }
  }, [polysynth])

  const startPlaying = useCallback(() => {
    if (polysynth) {
      polysynth.triggerAttack(notesToPlay.map(n => n.frequency), undefined, 0.7)
      setPlayingSound(true)
    } else {
      console.warn('no synth initialized')
    }
  }, [polysynth, notesToPlay])

  const stopPlaying = useCallback(() => {
    if (polysynth) {
      polysynth.triggerRelease(notesToPlay.map(n => n.frequency))
      setPlayingSound(false)
    } else {
      console.warn('no synth initialized')
    }
  }, [polysynth, notesToPlay])

  // play notes
  useEffect(() => {
    if (polysynth !== undefined) {
      startPlaying()

      return () => {
        stopPlaying()
      }
    }
  }, [polysynth, notesToPlay])

  useEffect(() => {
    if (polysynth) {
      if (isPlaying) {
        startPlaying()
      } else {
        stopPlaying()
      }
    }
  }, [isPlaying])

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

  // Is the user right ?
  const compareToSecretInterval = useCallback((interval: Interval) => {
    if (randomIntervals.some(i => Interval.equals(i, interval))) {
      onWin()
    } else {
      onLoose()
    }
  }, [randomIntervals])

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
