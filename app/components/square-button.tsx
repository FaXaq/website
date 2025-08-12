'use client'

import React from 'react'
import classNames from 'classnames'

interface SquareButtonProps {
  text: string
  isActive: boolean
  onClick: (...e: any) => any
}

const SquareButton = ({ text, isActive, onClick }: SquareButtonProps) => {
  return (
    <button onClick={(e) => onClick(e)}>
      {text}
    </button>
  )
}

export default SquareButton
