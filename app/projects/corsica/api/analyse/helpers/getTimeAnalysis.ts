import { GPXJson } from '../../helpers/parseActivity'
import { getDurationBetweenPoints, getSpeedBetweenPoints } from './betweenPoints'

export interface TimeAnalysis {
    meta: string,
    start: string,
    end: string,
    movingTimeVariations: Array<number>,
    totalMovingTime: number
}

// Arbitrary, in cycling if we move at less that 3km/h we are not considered in movement
const MIN_KM_H_SPEED_FOR_MOVING_TIME = 2

export default function getTimeAnalysis(parsedFile: GPXJson): TimeAnalysis {
  let totalMovingTime = 0
  const movingTimeVariations = [0]
  const trkpts = parsedFile.gpx.trk.trkseg.trkpt
  let previousPoint = parsedFile.gpx.trk.trkseg.trkpt[0]

  for (let i = 1; i < trkpts.length; i++) {
    const currentPoint = trkpts[i]
    const speed = getSpeedBetweenPoints(previousPoint, currentPoint)
    if (speed >= MIN_KM_H_SPEED_FOR_MOVING_TIME) {
      totalMovingTime += getDurationBetweenPoints(previousPoint, currentPoint, 'milliseconds')
    }
    movingTimeVariations.push(totalMovingTime)
    previousPoint = currentPoint
  }

  return {
    meta: parsedFile.gpx.metadata?.time,
    start: parsedFile.gpx.trk.trkseg.trkpt[0].time,
    end: parsedFile.gpx.trk.trkseg.trkpt[parsedFile.gpx.trk.trkseg.trkpt.length - 1].time,
    movingTimeVariations,
    totalMovingTime
  }
}
