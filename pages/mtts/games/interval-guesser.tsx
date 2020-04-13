import React, { useEffect } from 'react'
import { INTERVALS, NOTES, Note, Interval } from 'mtts'
import { useTranslation } from 'react-i18next'
import { shuffleArray, getRandomEntity, getRandomEntities } from '../../../utils/misc'
import IntervalGuesserButton from '../../../components/mtts/games/interval-guesser/button'
import { PolySynth, Synth } from 'tone'

interface Level {
  notes: Note[],
  intervals: Interval[]
}

const LEVELS: { [key: string]: Level } = {
  easy: {
    notes: NOTES.map(n => new Note({ name: n })),
    intervals: Object.keys(INTERVALS)
      .map(i => Interval.fromName(i))
      .reduce((previous, current) => {
        return previous.findIndex((pi) => current.semitones === pi.semitones) === -1 && current.semitones <= 12
          ? [...previous, current]
          : [...previous]
      }, [])
  }
}

const IntervalGuesser = () => {
  const { t } = useTranslation()

  const randomNote = getRandomEntity(LEVELS.easy.notes)
  const randomIntervals = getRandomEntities(LEVELS.easy.intervals)
  const remainingIntervals = getRandomEntities(
    LEVELS.easy.intervals.filter(i => randomIntervals.findIndex((ri: Interval) => ri.name === i.name) < 0),
    4
  )

  function compareToSecretInterval (interval: Interval) {
    console.log(randomIntervals.some(i => Interval.equals(i, interval)))
    return randomIntervals.some(i => Interval.equals(i, interval))
  }

  const displayIntervals = shuffleArray(
    [
      ...randomIntervals,
      ...remainingIntervals
    ].map(i => (
      <li key={`interval-${i.name}`}>
        <IntervalGuesserButton onClick={() => compareToSecretInterval(i) }>
          <span>{i.name}</span>
        </IntervalGuesserButton>
      </li>
    ))
  )

  const notesToPlay = [randomNote, ...randomIntervals.map(i => i.apply(randomNote))]

  useEffect(() => {
    console.log(notesToPlay)
    const polysynth = new PolySynth(2, Synth).toMaster()
    polysynth.set('volume', -10)
    polysynth.set('detune', -1200)
    polysynth.triggerAttackRelease(notesToPlay.map(n => n.frequency), 5)
  })

  return <div className="bg-mtts-light-violet h-screen w-screen">
    <h1 className="text-8xl font-mtts-title font-bold text-center text-mtts-white uppercase py-12">
      {t('mtts.games.intervalGuesser.title')}
    </h1>
    <ul className="flex justify-center">
      {displayIntervals}
    </ul>
  </div>
}

export default IntervalGuesser
