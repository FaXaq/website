import React from 'react'

interface IntervalGuesserButtonProps {
  children: JSX.Element | JSX.Element[]
  onClick?: (...e: any) => any
}

const IntervalGuesserButton = ({ onClick, children }: IntervalGuesserButtonProps) => {
  return (
    <button
      className="border-4 md:border-8 rounded w-16 h-16 md:w-24 md:h-24 m-1 md:mx-4 font-mtts-title font-bold text-xl md:text-3xl text-mtts-dark-violet border-mtts-dark-violet"
      onClick={ (e) => onClick !== undefined ? onClick(e) : () => {} }
    >
      { children }
    </button>
  )
}

export default IntervalGuesserButton
