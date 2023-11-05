import { GPXTrkPart } from '../../helpers/parseActivity'
import turfDistance from '@turf/distance'

export interface DistanceAnalysis {
    totalDistance: number,
    distanceVariations: Array<number>
}

export default function getDistanceVariations(trkpts: Array<GPXTrkPart>): DistanceAnalysis {
  if (trkpts.length < 2) {
    return {
      totalDistance: 0,
      distanceVariations: [0]
    }
  }

  let previousPoint = trkpts[0]
  let totalDistance = 0
  const distanceVariations = [0]
  for (let i = 1; i < trkpts.length; i++) {
    // In this loop we're dealing with kilometers
    const currentPoint = trkpts[i]
    const eleDifference = Math.abs(previousPoint.ele - currentPoint.ele)
    const distanceBetweenPoints = turfDistance(
      [parseFloat(previousPoint.__ATTRIBUTE__lon), parseFloat(previousPoint.__ATTRIBUTE__lat)],
      [parseFloat(currentPoint.__ATTRIBUTE__lon), parseFloat(currentPoint.__ATTRIBUTE__lat)],
      {
        units: 'meters'
      }
    )
    const distanceBetweenPointsWithEle = Math.sqrt((eleDifference * eleDifference) + (distanceBetweenPoints * distanceBetweenPoints))
    distanceVariations.push(distanceVariations[distanceVariations.length - 1] + distanceBetweenPointsWithEle)
    totalDistance += distanceBetweenPointsWithEle
    previousPoint = currentPoint
  }

  return {
    totalDistance,
    distanceVariations
  }
}
