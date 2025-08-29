'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
// eslint-disable-next-line no-unused-vars
import { Level } from '../page'
import IntervalGuesserButton from './button'
import { LEVELS } from '../const'

interface IntervalGuesserStartScreenProps {
  onStart: (level: Level) => any;
}

const IntervalGuesserStartScreen = ({ onStart }: IntervalGuesserStartScreenProps) => {
  const { t } = useTranslation()
  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <IntervalGuesserButton
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        onClick={() => onStart(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </IntervalGuesserButton>
    </li>
  ))
  return (
    <div>
      <p >
        {t('mtts.games.intervalGuesser.description')}
      </p>
      <ul >
        {levelsButtons}
      </ul>
    </div>
  )
}

export default IntervalGuesserStartScreen
