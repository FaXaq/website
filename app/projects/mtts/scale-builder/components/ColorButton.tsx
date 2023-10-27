/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import classNames from 'classnames'

export enum COLOR {
  DEFAULT = 'color-default',
  YELLOW = 'color-yellow',
  KHAKI = 'color-khaki',
  GREEN = 'color-green',
  BLUE = 'color-blue',
  VIOLET = 'color-violet',
  RED = 'color-red'
}

interface ColorButtonProps {
    color: COLOR,
    children: React.ReactNode,
    isActive: boolean,
    onClick: (...e: any) => any
}

function ColorButton({ children, isActive, onClick, color }: ColorButtonProps) {
  const classes = classNames({
    'w-10 h-10 border-2 rounded-lg m-1 font-mtts-title font-semibold text-lg': true,
    'text-white': isActive,
    'bg-mtts-cta-1': isActive && color === COLOR.DEFAULT,
    'hover:bg-mtts-yellow-active': color === COLOR.YELLOW,
    'bg-mtts-yellow': isActive && color === COLOR.YELLOW,
    'hover:bg-mtts-khaki-active': color === COLOR.KHAKI,
    'bg-mtts-khaki': isActive && color === COLOR.KHAKI,
    'hover:bg-mtts-green-active': color === COLOR.GREEN,
    'bg-mtts-green': isActive && color === COLOR.GREEN,
    'hover:bg-mtts-blue-active': color === COLOR.BLUE,
    'bg-mtts-blue': isActive && color === COLOR.BLUE,
    'hover:bg-mtts-violet-active': color === COLOR.VIOLET,
    'bg-mtts-violet': isActive && color === COLOR.VIOLET,
    'hover:bg-mtts-red-active': color === COLOR.RED,
    'bg-mtts-red': isActive && color === COLOR.RED
  })
  return (
    <button className={classes} onClick={(e) => onClick(e)}>
      {children}
    </button>
  )
}

export default ColorButton
