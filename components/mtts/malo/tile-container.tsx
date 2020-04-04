import React from 'react'

interface TileContainerProps {
  tileLines: JSX.Element[];
}

const TileContainer = ({ tileLines }: TileContainerProps) => {
  return <div className="flex flex-col h-screen">{tileLines}</div>
}

export default TileContainer
