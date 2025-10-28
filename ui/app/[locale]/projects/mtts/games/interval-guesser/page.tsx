'use client';


import type { Interval,Note } from 'mtts';
import { useTranslation } from 'next-i18next';
import React, { useMemo,useState } from 'react';

import { getRandomEntity } from '@/utils/misc';

import IntervalGuesserGame from './components/game';
import IntervalGuesserModal from './components/modal';
import IntervalGuesserStartScreen from './components/start-screen';
import { LEVELS } from './const';

export interface Level {
  notes: Note[],
  intervals: Interval[],
  intervalsToGuess: number
}

const IntervalGuesser = () => {
  const { t } = useTranslation();
  const [level, setLevel] = useState<typeof LEVELS[string]>(LEVELS.easy);
  const [isChoosingLevel, setIsChoosingLevel] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [randomNote, setRandomNote] = useState<Note>(getRandomEntity(level.notes));
  const [hasWon, setHasWon] = useState(false);

  function endGame (win: boolean) {
    if (win) {
      setHasWon(true);
    } else {
      setHasWon(false);
    }
    setIsPlaying(false);
    setIsShowingModal(true);
  }

  function startGame () {
    setIsShowingModal(false);
    setRandomNote(getRandomEntity(level.notes));
    setIsPlaying(true);
  }

  function setLevelAndStartGame (level: Level) {
    setLevel(level);
    setIsChoosingLevel(false);
    startGame();
  }

  const game = useMemo(() => (
    <IntervalGuesserGame
      note={randomNote}
      onWin={() => endGame(true)}
      onLoose={() => endGame(false)}
      level={level}
      isPlaying={isPlaying}
    />
  ), [randomNote, level, isPlaying]);

  return (
    <div >
      <h1 >
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
  );
};

export default IntervalGuesser;
