import React from 'react'
import classNames from 'classnames'

interface IntervalGuesserButtonProps {
  children: React.JSX.Element | React.JSX.Element[]
  onClick?: (...e: any) => any
  title?: string
  fixedSize?: boolean
}

const IntervalGuesserButton = ({ onClick, children, title, fixedSize }: IntervalGuesserButtonProps) => {
  const classes = classNames({
    'border md:border-2 rounded m-1 md:mx-4 font-mtts-title font-bold text-xl md:text-3xl text-mtts-dark-violet border-mtts-dark-violet': true,
    'w-16 h-16 md:w-24 md:h-24': fixedSize,
    'px-6 py-2': !fixedSize,
    'hover:bg-mtts-light-violet hover:text-mtts-white': true
  })

  return (
    <button
      title={title}
      className={classes}
      onClick={ (e) => onClick !== undefined ? onClick(e) : () => {} }
    >
      { children }
    </button>
  )
}

export default IntervalGuesserButton
