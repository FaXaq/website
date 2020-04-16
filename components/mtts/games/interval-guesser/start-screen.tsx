import React from 'react'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { Level, LEVELS } from '../../../../pages/mtts/games/interval-guesser'

interface IntervalGuesserStartScreenProps {
  onStart: (level: Level) => any;
}

const IntervalGuesserStartScreen = ({ onStart }: IntervalGuesserStartScreenProps) => {
  const { t } = useTranslation()
  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <button
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        className="text-mtts-dark-violet border-4 rounded border-mtts-dark-violet p-4 mx-2 font-bold uppercase"
        onClick={() => onStart(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </button>
    </li>
  ))
  return (
    <div>
      <p className="font-mtts-text font-thin text-mtts-dark-violet px-6 text-sm md:text-lg text-justify max-w-3xl mx-auto">
        {t('mtts.games.intervalGuesser.description')}
      </p>
      <ul className="flex flex-wrap justify-center p-4">
        {levelsButtons}
      </ul>
    </div>
  )
}

export default IntervalGuesserStartScreen
