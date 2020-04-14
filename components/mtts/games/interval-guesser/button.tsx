import React from 'react'

interface IntervalGuesserButtonProps {
  children: JSX.Element | JSX.Element[]
  onClick?: (...e: any) => any
}

const IntervalGuesserButton = ({ onClick, children }: IntervalGuesserButtonProps) => {
  return (
    <button
      className="border-4 rounded w-24 h-24 m-2 font-mtts-title font-bold text-xl text-mtts-white"
      onClick={ (e) => onClick !== undefined ? onClick(e) : () => {} }
    >
      { children }
    </button>
  )
}

export default IntervalGuesserButton
