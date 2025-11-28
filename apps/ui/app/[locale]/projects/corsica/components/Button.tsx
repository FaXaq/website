'use client';

import React from 'react';

import LoadingIcon from './LoadingIcon';

interface ButtonProps {
    children: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    type: 'button' | 'submit' | 'reset',
    loading: boolean
}

export default function Button({ onClick, type, children, loading }: ButtonProps) {
  const proxyOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={proxyOnClick}
      disabled={loading}
    >
      { loading && <span ><LoadingIcon /></span> }
      {children}
    </button>
  );
}
