import React from 'react'

interface TileLineProps {
  index: number;
  tiles: JSX.Element[];
}

const TileLine = ({ tiles, index }: TileLineProps) => {
  const classes = ['line', 'flex']

  if (index % 2 !== 0) {
    classes.push('odd-line')
  }
  return <div className={classes.join(' ')}>{tiles}</div>
}

export default TileLine
