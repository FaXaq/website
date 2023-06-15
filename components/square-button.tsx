import React from 'react'
import classNames from 'classnames'

interface SquareButtonProps {
  text: string
  isActive: boolean
  onClick: (...e: any) => any
}

const SquareButton = ({ text, isActive, onClick }: SquareButtonProps) => {
  const classes = classNames({
    'w-10 h-10 border-2 rounded-lg m-1 text-mtts-dark-violet-200 border-mtts-dark-violet-200 font-mtts-title font-semibold text-lg': true,
    'hover:bg-mtts-cta-2': !isActive,
    'bg-mtts-cta-2 hover:bg-mtts-cta-0': isActive
  })
  return (
    <button className={classes} onClick={(e) => onClick(e)}>
      {text}
    </button>
  )
}

export default SquareButton
