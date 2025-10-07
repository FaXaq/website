'use client'

import React from 'react'

interface IntervalGuesserButtonProps {
  children: React.ReactNode
  onClick?: (...e: any) => any
  title?: string
  fixedSize?: boolean
}

const IntervalGuesserButton = ({ onClick, children, title }: IntervalGuesserButtonProps) => {
  return (
    <button
      title={title}
      onClick={ (e) => onClick !== undefined ? onClick(e) : () => {} }
    >
      { children }
    </button>
  )
}

export default IntervalGuesserButton
