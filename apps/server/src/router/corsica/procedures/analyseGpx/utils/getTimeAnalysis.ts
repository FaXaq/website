import type { GPXJson, TimeAnalysis } from '@repo/schemas/api/procedures/corsica';

import { getDurationBetweenPoints, getSpeedBetweenPoints } from './betweenPoints';

// Arbitrary, in cycling if we move at less that 3km/h we are not considered in movement
const MIN_KM_H_SPEED_FOR_MOVING_TIME = 2;

export default function getTimeAnalysis(parsedFile: GPXJson): TimeAnalysis {
  let totalMovingTime = 0;
  const movingTimeVariations = [0];
  const trkpts = parsedFile.gpx.trk.trkseg.trkpt;

  if (!trkpts[0]) {
    throw new Error('Cannot compute time analysis: no trkpts');
  }

  let previousPoint = trkpts[0];

  trkpts.forEach((currentPoint, i) => {
    if (i === 0) return;
    const speed = getSpeedBetweenPoints(previousPoint, currentPoint);
    if (speed >= MIN_KM_H_SPEED_FOR_MOVING_TIME) {
      totalMovingTime += getDurationBetweenPoints(previousPoint, currentPoint, 'milliseconds');
    }
    movingTimeVariations.push(totalMovingTime);
    previousPoint = currentPoint;
  })

  return {
    meta: parsedFile.gpx.metadata?.time,
    start: trkpts[0].time,
    end: trkpts[trkpts.length - 1]?.time,
    movingTimeVariations,
    totalMovingTime
  };
}
