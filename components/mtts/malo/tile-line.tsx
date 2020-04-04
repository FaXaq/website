import React from 'react'

interface TileLineProps {
  tiles: JSX.Element[];
}

const TileLine = ({ tiles }: TileLineProps) => {
  return <div className="flex flex-grow">{tiles}</div>
}

export default TileLine
