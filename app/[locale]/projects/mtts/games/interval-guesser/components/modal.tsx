'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
// eslint-disable-next-line no-unused-vars
import { Level } from '../page'
import classNames from 'classnames'
import IntervalGuesserButton from './button'
import { LEVELS } from '../const'

interface IntervalGuesserModalProps {
  isShowing: boolean
  children?: React.JSX.Element | React.JSX.Element[]
  onClose: (level: Level) => any
  hasWon: boolean
  level: Level
}

const IntervalGuesserModal = ({ isShowing, onClose, hasWon, level }: IntervalGuesserModalProps) => {
  const { t } = useTranslation()

  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <IntervalGuesserButton
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        onClick={() => onClose(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </IntervalGuesserButton>
    </li>
  ))

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
    ) : null
}

export default IntervalGuesserModal
