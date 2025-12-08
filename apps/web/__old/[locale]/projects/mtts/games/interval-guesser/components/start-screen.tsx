'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { LEVELS } from '../const';
import type { Level } from '../page';
import IntervalGuesserButton from './button';

interface IntervalGuesserStartScreenProps {
  onStart: (level: Level) => void;
}

const IntervalGuesserStartScreen = ({ onStart }: IntervalGuesserStartScreenProps) => {
  const { t } = useTranslation();
  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <IntervalGuesserButton
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        onClick={() => onStart(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </IntervalGuesserButton>
    </li>
  ));
  return (
    <div>
      <p >
        {t('mtts.games.intervalGuesser.description')}
      </p>
      <ul >
        {levelsButtons}
      </ul>
    </div>
  );
};

export default IntervalGuesserStartScreen;
