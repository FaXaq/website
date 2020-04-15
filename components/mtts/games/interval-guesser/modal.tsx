import React from 'react'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { LEVELS, Level } from '../../../../pages/mtts/games/interval-guesser'
import classNames from 'classnames'

interface IntervalGuesserModalProps {
  isShowing: boolean
  children?: JSX.Element | JSX.Element[]
  onClose: (level: Level) => any
  hasWon: boolean
  level: Level
}

const IntervalGuesserModal = ({ isShowing, onClose, hasWon, level }: IntervalGuesserModalProps) => {
  const { t } = useTranslation()

  const levelsButtons = Object.keys(LEVELS).map((levelName) => (
    <li key={levelName}>
      <button
        title={t(`mtts.games.intervalGuesser.levels.${levelName}.alt`)}
        className="text-mtts-light-violet border-4 rounded border-mtts-light-violet p-4 m-2 font-bold uppercase"
        onClick={() => onClose(LEVELS[levelName])}
      >
        {t(`mtts.games.intervalGuesser.levels.${levelName}.title`)}
      </button>
    </li>
  ))

  return isShowing
    ? (
      <>
        <div
          className="modal-overlay absolute inset-0 opacity-25 bg-mtts-dark-violet"
          onClick={() => onClose(level)}
        >
        </div>
        <div className="absolute top-0 left-0 bg-mtts-white rounded center-absolute shadow p-4">
          <h3 className={classNames({
            'text-3xl font-bold font-mtts-title text-center': true,
            'text-mtts-success': hasWon,
            'text-mtts-error': !hasWon
          })}>{
              hasWon
                ? t('mtts.games.intervalGuesser.win')
                : t('mtts.games.intervalGuesser.lost')
            }</h3>
          <ul className="flex jusitify-center p-4">
            {levelsButtons}
          </ul>
        </div>
      </>
    ) : null
}

export default IntervalGuesserModal
