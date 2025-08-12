'use client'

import React from 'react'
import classNames from 'classnames'

interface IntervalGuesserButtonProps {
  children: React.ReactNode
  onClick?: (...e: any) => any
  title?: string
  fixedSize?: boolean
}

const IntervalGuesserButton = ({ onClick, children, title, fixedSize }: IntervalGuesserButtonProps) => {
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
