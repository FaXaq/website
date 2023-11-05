import { GPXTrkPart } from '../../helpers/parseActivity'
import turfDistance from '@turf/distance'

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
    const currentDistanceBetweenPoints = turfDistance(
      [parseFloat(previousPoint.__ATTRIBUTE__lon), parseFloat(previousPoint.__ATTRIBUTE__lat)],
      [parseFloat(currentPoint.__ATTRIBUTE__lon), parseFloat(currentPoint.__ATTRIBUTE__lat)],
      {
        units: 'kilometers'
      }
    )
    const currentTimeBetweenPoints = (new Date(currentPoint.time).getTime() - new Date(previousPoint.time).getTime()) / (1000 * 60 * 60)
    const currentSpeedBetweenPoints = currentDistanceBetweenPoints / currentTimeBetweenPoints

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
