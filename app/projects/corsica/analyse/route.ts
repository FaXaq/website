import { NextRequest, NextResponse } from 'next/server'
import { getFilesFromRequest } from '../helpers/api/getFilesFromRequest'
import { GPXTrkPart, parseGPX } from '../helpers/api/parseActivity'
import { ApiError } from '../helpers/api/const'
import turfDistance from '@turf/distance'
import turfCenter from '@turf/center'
import { points as turfPoints } from '@turf/helpers'

interface Coordinates {
  lon: number,
  lat: number
}

interface ElevationVariation {
  elevationGain: number,
  elevationLoss: number,
  gradient: number
}

interface ElevationVariationAnalysis {
    totalElevationGain: number,
    totalElevationLoss: number,
    elevationVariations: Array<ElevationVariation>
}

interface DistanceAnalysis {
  totalDistance: number,
  distanceVariations: Array<number>
}

interface SpeedAnalysis {
  maxSpeed: number,
  minSpeed: number,
  averageSpeed: number,
  speedVariations: Array<number>
}

export interface MapAnalysis {
  center: Coordinates,
  boundaries: [
    Coordinates,
    Coordinates
  ]
}

export interface Analysis {
  map: MapAnalysis,
  elevation: ElevationVariationAnalysis,
  distance: DistanceAnalysis,
  speed: SpeedAnalysis,
  points: Array<GPXTrkPart>
}

function getSpeedAnalysis(trkpts: Array<GPXTrkPart>): SpeedAnalysis {
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

function getElevationVariations(trkpts: Array<GPXTrkPart>): ElevationVariationAnalysis {
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
  const elevationVariations = []
  let maxPoint = trkpts[0].ele
  let minPoint = trkpts[0].ele
  let ascending = trkpts[0].ele - trkpts[1].ele < 0
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

    const previousElevationVariation: ElevationVariation = elevationVariations.length > 0 ? elevationVariations[elevationVariations.length - 1] : { elevationGain: 0, elevationLoss: 0 }
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

function getMapAnalysis(trkpts: Array<GPXTrkPart>): MapAnalysis {
  if (trkpts.length < 2) {
    return {
      boundaries: [
        {
          lon: parseFloat(trkpts[0].__ATTRIBUTE__lon),
          lat: parseFloat(trkpts[0].__ATTRIBUTE__lat)
        },
        {
          lon: parseFloat(trkpts[0].__ATTRIBUTE__lon),
          lat: parseFloat(trkpts[0].__ATTRIBUTE__lat)
        }
      ],
      center: {
        lon: parseFloat(trkpts[0].__ATTRIBUTE__lon),
        lat: parseFloat(trkpts[0].__ATTRIBUTE__lat)
      }
    }
  }

  let minLon = parseFloat(trkpts[0].__ATTRIBUTE__lon)
  let maxLon = parseFloat(trkpts[0].__ATTRIBUTE__lon)
  let minLat = parseFloat(trkpts[0].__ATTRIBUTE__lat)
  let maxLat = parseFloat(trkpts[0].__ATTRIBUTE__lat)

  for (let i = 1; i < trkpts.length; i++) {
    const currentPoint = trkpts[i]

    if (parseFloat(currentPoint.__ATTRIBUTE__lat) < minLat) {
      minLat = parseFloat(currentPoint.__ATTRIBUTE__lat)
    }

    if (parseFloat(currentPoint.__ATTRIBUTE__lat) > maxLat) {
      maxLat = parseFloat(currentPoint.__ATTRIBUTE__lat)
    }

    if (parseFloat(currentPoint.__ATTRIBUTE__lon) < minLon) {
      minLon = parseFloat(currentPoint.__ATTRIBUTE__lon)
    }

    if (parseFloat(currentPoint.__ATTRIBUTE__lon) > maxLon) {
      maxLon = parseFloat(currentPoint.__ATTRIBUTE__lon)
    }
  }

  const center = turfCenter(turfPoints([
    [minLon, maxLat],
    [maxLon, minLat],
    [minLon, minLat],
    [maxLon, maxLat]
  ]))

  return {
    boundaries: [
      {
        lon: minLon,
        lat: minLat
      },
      {
        lon: maxLon,
        lat: maxLat
      }
    ],
    center: {
      lon: center.geometry.coordinates[0],
      lat: center.geometry.coordinates[1]
    }
  }
}

function getDistanceVariations(trkpts: Array<GPXTrkPart>): DistanceAnalysis {
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<Analysis | ApiError>> {
  // Should be only one file, or if not, take the first one only anyway
  const file = (await getFilesFromRequest(request))[0]
  const parsedFile = await parseGPX(file)
  let trkpts: Array<GPXTrkPart> = []

  try {
    trkpts = parsedFile.gpx.trk.trkseg.trkpt
  } catch (e) {
    return NextResponse.json({
      error: {
        message: 'Cannot find track parts'
      }
    }, {
      status: 500
    })
  }

  const { totalElevationGain, totalElevationLoss, elevationVariations } = getElevationVariations(trkpts)
  const { totalDistance, distanceVariations } = getDistanceVariations(trkpts)
  const { center, boundaries } = getMapAnalysis(trkpts)
  const { maxSpeed, minSpeed, averageSpeed, speedVariations } = getSpeedAnalysis(trkpts)

  return NextResponse.json(
    {
      map: {
        center,
        boundaries
      },
      elevation: {
        totalElevationGain,
        totalElevationLoss,
        elevationVariations
      },
      distance: {
        totalDistance,
        distanceVariations
      },
      points: [
        ...trkpts
      ],
      speed: {
        maxSpeed,
        minSpeed,
        averageSpeed,
        speedVariations
      }
    },
    { status: 200 }
  )
}
