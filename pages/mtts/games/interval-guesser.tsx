import React, { useState, useMemo } from 'react'
import { getRandomEntity } from '../../../utils/misc'
import IntervalGuesserGame from '../../../components/mtts/games/interval-guesser/game'
// eslint-disable-next-line no-unused-vars
import { Note, Interval, NOTES, INTERVALS } from 'mtts'
import IntervalGuesserModal from '../../../components/mtts/games/interval-guesser/modal'
import { useTranslation } from 'react-i18next'

export interface Level {
  notes: Note[],
  intervals: Interval[],
  intervalsToGuess: number
}

export const LEVELS: { [key: string]: Level } = {
  easy: {
    notes: NOTES.map(n => new Note({ name: n })),
    intervals: Object.keys(INTERVALS)
      .map(i => Interval.fromName(i))
      .reduce((previous, current) => {
        return previous.findIndex((pi) => current.semitones === pi.semitones) === -1 && current.semitones <= 12 && current.semitones > 0
          ? [...previous, current]
          : [...previous]
      }, []),
    intervalsToGuess: 1
  }
}

const IntervalGuesser = () => {
  const { t } = useTranslation()
  const [level] = useState<typeof LEVELS[string]>(LEVELS.easy)
  const [isPlaying, setIsPlaying] = useState(true)
  const [randomNote, setRandomNote] = useState<Note>(getRandomEntity(level.notes))
  const [hasWon, setHasWon] = useState(false)

  function endGame (win: boolean) {
    if (win) {
      setHasWon(true)
    } else {
      setHasWon(false)
    }
    setIsPlaying(false)
    setIsShowingModal(true)
  }

  function startGame () {
    setIsShowingModal(false)
    setRandomNote(getRandomEntity(level.notes))
    setIsPlaying(true)
  }

  const game = useMemo(() => (
    <IntervalGuesserGame
      note={ randomNote }
      onWin={ () => endGame(true) }
      onLoose={ () => endGame(false) }
      level={ level }
      isPlaying={ isPlaying }
    />
  ), [randomNote, level, isPlaying])

  const [isShowingModal, setIsShowingModal] = useState(false)

  return (
    <div className="bg-mtts-light-violet h-screen w-screen relative">
      <h1 className="text-5xl md:text-8xl font-mtts-title font-bold text-center text-mtts-white uppercase py-6">
        {t('mtts.games.intervalGuesser.title')}
      </h1>
      <p className="font-mtts-text font-thin text-mtts-white px-6 text-sm text-justify max-w-3xl mx-auto">
        {t('mtts.games.intervalGuesser.description')}
      </p>
      {game}
      <IntervalGuesserModal isShowing={isShowingModal} onClose={() => startGame()} hasWon={hasWon}>
      </IntervalGuesserModal>
    </div>
  )
}

export default IntervalGuesser
