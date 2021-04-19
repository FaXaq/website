import React, { useState, useMemo } from 'react'
import { getRandomEntity } from '../../../../utils/misc'
import IntervalGuesserGame from '../../../../components/mtts/games/interval-guesser/game'
// eslint-disable-next-line no-unused-vars
import { Note, Interval, NOTES, INTERVALS } from 'mtts'
import IntervalGuesserModal from '../../../../components/mtts/games/interval-guesser/modal'
import { useTranslation } from 'react-i18next'
import IntervalGuesserStartScreen from '../../../../components/mtts/games/interval-guesser/start-screen'

export interface Level {
  notes: Note[],
  intervals: Interval[],
  intervalsToGuess: number
}

export const LEVELS: { [key: string]: Level } = {
  easy: {
    notes: [new Note({ name: 'C' })],
    intervals: Object.keys(INTERVALS)
      .map(i => Interval.fromName(i))
      .reduce((previous, current) => {
        return previous.findIndex((pi) => current.semitones === pi.semitones) === -1 && current.semitones <= 12 && current.semitones > 0
          ? [...previous, current]
          : [...previous]
      }, []),
    intervalsToGuess: 1
  },
  intermediate: {
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
  const [level, setLevel] = useState<typeof LEVELS[string]>(LEVELS.easy)
  const [isChoosingLevel, setIsChoosingLevel] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
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

  function setLevelAndStartGame (level: Level) {
    setLevel(level)
    setIsChoosingLevel(false)
    startGame()
  }

  const game = useMemo(() => (
    <IntervalGuesserGame
      note={randomNote}
      onWin={() => endGame(true)}
      onLoose={() => endGame(false)}
      level={level}
      isPlaying={isPlaying}
    />
  ), [randomNote, level, isPlaying])

  return (
    <div className="bg-mtts-white h-screen w-screen relative">
      <h1 className="text-5xl md:text-8xl font-mtts-title font-bold text-center text-mtts-dark-violet uppercase py-6">
        {t('mtts.games.intervalGuesser.title')}
      </h1>
      {
        isChoosingLevel
          ? <IntervalGuesserStartScreen onStart={(level: Level) => setLevelAndStartGame(level)} />
          : game
      }
      <IntervalGuesserModal
        isShowing={isShowingModal}
        onClose={(level: Level) => setLevelAndStartGame(level)}
        hasWon={hasWon}
        level={level}
      >
      </IntervalGuesserModal>
    </div>
  )
}

export default IntervalGuesser
