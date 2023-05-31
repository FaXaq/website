import React from 'react'
import classNames from 'classnames'
import DetachableWindowMenu from './menu'

interface DetachableWindowProps {
  attached: boolean;
  children: React.JSX.Element;
}

const DetachableWindow = ({ children, attached }: DetachableWindowProps) => {
  return (
    <div className={classNames({
      'detachable-window absolute': true,
      'h-1/2 w-1/2': attached
    })}>
      <DetachableWindowMenu />
      {children}
    </div>
  )
}

export default DetachableWindow
