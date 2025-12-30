import type { GPXTrkPart, SpeedAnalysis } from '@repo/schemas/api/procedures/corsica';

import { getSpeedBetweenPoints } from './betweenPoints';

export default function getSpeedAnalysis(trkpts: Array<GPXTrkPart>): SpeedAnalysis {
  if (!trkpts[0] || !trkpts[1]) {
    return {
      maxSpeed: 0,
      minSpeed: 0,
      averageSpeed: 0,
      speedVariations: [
        0
      ]
    };
  }

  let minSpeed = 0;
  let maxSpeed = 0;
  let previousPoint = trkpts[0];
  const speedVariations = [0];

  trkpts.forEach((currentPoint, i) => {
    if (i === 0) return;

    const currentSpeedBetweenPoints = getSpeedBetweenPoints(previousPoint, currentPoint, 'kilometers', 'hours');

    if (currentSpeedBetweenPoints < minSpeed || minSpeed === 0) {
      minSpeed = currentSpeedBetweenPoints;
    }

    if (currentSpeedBetweenPoints > maxSpeed) {
      maxSpeed = currentSpeedBetweenPoints;
    }

    speedVariations.push(currentSpeedBetweenPoints);
    previousPoint = currentPoint;
  });

  return {
    minSpeed,
    maxSpeed,
    speedVariations,
    averageSpeed: speedVariations.reduce((p, c) => p + c) / speedVariations.length
  };
}
