import { differenceInMilliseconds } from 'date-fns'
import { GPXTrkPart } from '../../helpers/parseActivity'
import turfDistance from '@turf/distance'

export type DistanceUnit = 'kilometers' | 'meters'

export function getDistanceBetweenPoints(pointA: GPXTrkPart, pointB: GPXTrkPart, units: DistanceUnit = 'meters') {
  return turfDistance(
    [parseFloat(pointA.__ATTRIBUTE__lon), parseFloat(pointA.__ATTRIBUTE__lat)],
    [parseFloat(pointB.__ATTRIBUTE__lon), parseFloat(pointB.__ATTRIBUTE__lat)],
    {
      units
    }
  )
}

export type TimeUnit = 'milliseconds' | 'hours' | 'seconds'

export function getDurationBetweenPoints(pointA: GPXTrkPart, pointB: GPXTrkPart, units: TimeUnit = 'milliseconds') {
  const millisecondsDifference = Math.abs(differenceInMilliseconds(new Date(pointB.time), new Date(pointA.time)))

  switch (units) {
  case 'hours':
    return millisecondsDifference / (1000 * 60 * 60)
  case 'seconds':
    return millisecondsDifference / (1000)
  case 'milliseconds':
  default:
    return millisecondsDifference
  }
}

export function getSpeedBetweenPoints(pointA: GPXTrkPart, pointB: GPXTrkPart, distanceUnit: DistanceUnit = 'meters', timeUnit: TimeUnit = 'seconds') {
  return getDistanceBetweenPoints(pointA, pointB, distanceUnit) / getDurationBetweenPoints(pointA, pointB, timeUnit)
}
