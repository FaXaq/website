/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import classNames from 'classnames'
import { COLOR } from '../helpers/getNoteColor'

interface ColorButtonProps {
    color: COLOR,
    children: React.ReactNode,
    isActive: boolean,
    onClick: (...e: any) => any
}

function ColorButton({ children, isActive, onClick, color }: ColorButtonProps) {
  return (
    <button onClick={(e) => onClick(e)}>
      {children}
    </button>
  )
}

export default ColorButton
