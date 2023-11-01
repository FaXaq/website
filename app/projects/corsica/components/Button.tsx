'use client'

import React from 'react'
import LoadingIcon from './LoadingIcon'

interface ButtonProps {
    children: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    type: 'button' | 'submit' | 'reset',
    loading: boolean
}

export default function Button({ onClick, type, children, loading }: ButtonProps) {
  const proxyOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      type={type}
      className="bg-corsica-blue bg-opacity-90 py-2 px-4 rounded text-white hover:bg-opacity-100 flex items-center"
      onClick={proxyOnClick}
      disabled={loading}
    >
      { loading && <span className="pr-2"><LoadingIcon /></span> }
      {children}
    </button>
  )
}
