import { ElevationVariation, ElevationVariationAnalysis, GPXTrkPart } from "@/projects/corsica/analyse/types"

export default function getElevationVariations(trkpts: Array<GPXTrkPart>): ElevationVariationAnalysis {
  if (trkpts.length < 2) {
    return {
      totalElevationGain: 0,
      totalElevationLoss: 0,
      elevationVariations: []
    }
  }

  let totalElevationGain = 0
  let totalElevationLoss = 0
  let previousElevationPoint = trkpts[0].ele
  let maxPoint = trkpts[0].ele
  let minPoint = trkpts[0].ele
  let ascending = trkpts[0].ele - trkpts[1].ele < 0
  const elevationVariations = [{
    elevationGain: 0,
    elevationLoss: 0,
    gradient: 0
  }]

  for (let i = 1; i < trkpts.length; i++) {
    const currentElevationPoint = trkpts[i].ele
    if (ascending) {
      if (maxPoint < currentElevationPoint) {
        maxPoint = currentElevationPoint
      } else {
        ascending = false
        totalElevationGain += maxPoint - minPoint
        minPoint = currentElevationPoint
      }
    } else {
      if (minPoint > currentElevationPoint) {
        minPoint = currentElevationPoint
      } else {
        ascending = true
        totalElevationLoss += maxPoint - minPoint
        maxPoint = currentElevationPoint
      }
    }

    const previousElevationVariation: ElevationVariation = elevationVariations.length > 0 ? elevationVariations[elevationVariations.length - 1] : { elevationGain: 0, elevationLoss: 0, gradient: 0 }
    const currentElevationVariation = currentElevationPoint - previousElevationPoint
    elevationVariations.push({
      elevationGain: currentElevationVariation > 0 ? previousElevationVariation.elevationGain + currentElevationVariation : previousElevationVariation.elevationGain,
      elevationLoss: currentElevationVariation < 0 ? previousElevationVariation.elevationLoss + Math.abs(currentElevationVariation) : previousElevationVariation.elevationLoss,
      gradient: currentElevationVariation / 100
    })
    previousElevationPoint = currentElevationPoint
  }

  return {
    totalElevationGain,
    totalElevationLoss,
    elevationVariations
  }
}
