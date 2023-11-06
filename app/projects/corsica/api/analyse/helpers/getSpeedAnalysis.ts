import { GPXTrkPart } from '../../helpers/parseActivity'
import { getSpeedBetweenPoints } from './betweenPoints'

export interface SpeedAnalysis {
  maxSpeed: number,
  minSpeed: number,
  averageSpeed: number,
  speedVariations: Array<number>
}

export default function getSpeedAnalysis(trkpts: Array<GPXTrkPart>): SpeedAnalysis {
  if (trkpts.length < 2) {
    return {
      maxSpeed: 0,
      minSpeed: 0,
      averageSpeed: 0,
      speedVariations: [
        0
      ]
    }
  }

  let minSpeed = 0
  let maxSpeed = 0
  let previousPoint = trkpts[0]
  const speedVariations = [0]

  for (let i = 1; i < trkpts.length; i++) {
    const currentPoint = trkpts[i]
    const currentSpeedBetweenPoints = getSpeedBetweenPoints(previousPoint, currentPoint, 'kilometers', 'hours')

    if (currentSpeedBetweenPoints < minSpeed || minSpeed === 0) {
      minSpeed = currentSpeedBetweenPoints
    }

    if (currentSpeedBetweenPoints > maxSpeed) {
      maxSpeed = currentSpeedBetweenPoints
    }

    speedVariations.push(currentSpeedBetweenPoints)
    previousPoint = currentPoint
  }

  return {
    minSpeed,
    maxSpeed,
    speedVariations,
    averageSpeed: speedVariations.reduce((p, c) => p + c) / speedVariations.length
  }
}
