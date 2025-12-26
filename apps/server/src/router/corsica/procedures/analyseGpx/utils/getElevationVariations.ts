import type { ElevationVariation, ElevationVariationAnalysis, GPXTrkPart } from "@repo/schemas/api/procedures/corsica";

export default function getElevationVariations(trkpts: Array<GPXTrkPart>): ElevationVariationAnalysis {
  if (trkpts.length < 2) {
    return {
      totalElevationGain: 0,
      totalElevationLoss: 0,
      elevationVariations: []
    };
  }

  let totalElevationGain = 0;
  let totalElevationLoss = 0;

  // those are defined because we know that the array is at least 2 elements long
  const firstPoint = trkpts[0]!;
  const secondPoint = trkpts[1]!;

  let previousElevationPoint = firstPoint.ele;
  let maxPoint = firstPoint.ele;
  let minPoint = firstPoint.ele;
  let ascending = firstPoint.ele - secondPoint.ele < 0;
  const elevationVariations = [{
    elevationGain: 0,
    elevationLoss: 0,
    gradient: 0
  }];

  trkpts.forEach((trkpt, i) => {
    if (i === 0) {
      return;
    }

    const currentElevationPoint = trkpt.ele;
    if (ascending) {
      if (maxPoint < currentElevationPoint) {
        maxPoint = currentElevationPoint;
      } else {
        ascending = false;
        totalElevationGain += maxPoint - minPoint;
        minPoint = currentElevationPoint;
      }
    } else {
      if (minPoint > currentElevationPoint) {
        minPoint = currentElevationPoint;
      } else {
        ascending = true;
        totalElevationLoss += maxPoint - minPoint;
        maxPoint = currentElevationPoint;
      }
    }

    const previousElevationVariation: ElevationVariation = elevationVariations.length > 0 ? elevationVariations[elevationVariations.length - 1]! : { elevationGain: 0, elevationLoss: 0, gradient: 0 };
    const currentElevationVariation = currentElevationPoint - previousElevationPoint;
    elevationVariations.push({
      elevationGain: currentElevationVariation > 0 ? previousElevationVariation.elevationGain + currentElevationVariation : previousElevationVariation.elevationGain,
      elevationLoss: currentElevationVariation < 0 ? previousElevationVariation.elevationLoss + Math.abs(currentElevationVariation) : previousElevationVariation.elevationLoss,
      gradient: currentElevationVariation / 100
    });
    previousElevationPoint = currentElevationPoint;
  })

  return {
    totalElevationGain,
    totalElevationLoss,
    elevationVariations
  };
}
