'use client';

import React from 'react';

interface IntervalGuesserButtonProps {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  title?: string
  fixedSize?: boolean
}

const IntervalGuesserButton = ({ onClick, children, title }: IntervalGuesserButtonProps) => {
  return (
    <button
      title={title}
      onClick={ (e) => onClick !== undefined ? onClick(e) : () => { throw new Error("Function not implemented"); } }
    >
      { children }
    </button>
  );
};

export default IntervalGuesserButton;
