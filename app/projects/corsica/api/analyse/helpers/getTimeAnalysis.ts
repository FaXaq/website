import { GPXJson } from '../../helpers/parseActivity'
import { getDurationBetweenPoints, getSpeedBetweenPoints } from './betweenPoints'

export interface TimeAnalysis {
    meta: string,
    start: string,
    end: string,
    movingTime: number
}

// Arbitrary, in cycling if we move at less that 3km/h we are not considered in movement
const MIN_KM_H_SPEED_FOR_MOVING_TIME = 2

export default function getTimeAnalysis(parsedFile: GPXJson): TimeAnalysis {
  let movingTime = 0
  const trkpts = parsedFile.gpx.trk.trkseg.trkpt
  let previousPoint = parsedFile.gpx.trk.trkseg.trkpt[0]

  for (let i = 1; i < trkpts.length; i++) {
    const currentPoint = trkpts[i]
    const speed = getSpeedBetweenPoints(previousPoint, currentPoint)
    console.log(speed)
    if (speed >= MIN_KM_H_SPEED_FOR_MOVING_TIME) {
      movingTime += getDurationBetweenPoints(previousPoint, currentPoint, 'milliseconds')
    }
    previousPoint = currentPoint
  }

  return {
    meta: parsedFile.gpx.metadata?.time,
    start: parsedFile.gpx.trk.trkseg.trkpt[0].time,
    end: parsedFile.gpx.trk.trkseg.trkpt[parsedFile.gpx.trk.trkseg.trkpt.length - 1].time,
    movingTime
  }
}
