'use client';

import { useTranslation } from 'next-i18next';
import React from 'react';

import { LEVELS } from '../const';
import type { Level } from '../page';
import IntervalGuesserButton from './button';

interface IntervalGuesserModalProps {
  isShowing: boolean
  children?: React.JSX.Element | React.JSX.Element[]
  onClose: (level: Level) => void
  hasWon: boolean
  level: Level
}

const IntervalGuesserModal = ({ isShowing, onClose, hasWon, level }: IntervalGuesserModalProps) => {
  const { t } = useTranslation();

  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <IntervalGuesserButton
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        onClick={() => onClose(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </IntervalGuesserButton>
    </li>
  ));

  return isShowing
    ? (
      <>
        <div

          onClick={() => onClose(level)}
        >
        </div>
        <div >
          <h3>{
            hasWon
              ? t('mtts.games.intervalGuesser.win')
              : t('mtts.games.intervalGuesser.lost')
          }</h3>
          <ul >
            {levelsButtons}
          </ul>
        </div>
      </>
    ) : null;
};

export default IntervalGuesserModal;
