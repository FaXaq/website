import { NextRequest, NextResponse } from 'next/server'
import { getFilesFromRequest } from '../helpers/getFilesFromRequest'
import { GPXJson, GPXTrkPart, parseGPX } from '../helpers/parseActivity'
import { ApiError } from '../helpers/const'
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

interface ReverseGeocodingJSONAddress {
  road: string,
  village: string,
  state_district: string,
  state: string,
  'ISO3166-2-lvl4'?: string,
  'ISO3166-2-lvl6'?: string,
  postcode: string,
  municipality: string,
  county: string,
  region: string,
  country: string,
  country_code: string
}

interface ReverseGeocodingJSON {
  place_id: number,
  license: string,
  osm_type: string,
  osl_id: number,
  lat: string,
  lon: string,
  category: string,
  type: string,
  place_rank: number,
  importance: number,
  addresstype: string,
  name: string,
  display_name: string,
  address: ReverseGeocodingJSONAddress,
  boundingbox: [string, string, string, string]
}

export interface MapAnalysis {
  center: Coordinates,
  boundaries: [
    Coordinates,
    Coordinates
  ],
  reverseGeocodingSearchResult: ReverseGeocodingJSON
}

export interface Analysis {
  name: string,
  activity: string,
  time?: string,
  map: MapAnalysis,
  elevation: ElevationVariationAnalysis,
  distance: DistanceAnalysis,
  speed: SpeedAnalysis | void,
  points: Array<GPXTrkPart>
}

function trackHasTime(file: GPXJson): boolean {
  return !!file.gpx.metadata?.time
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

async function reverseGeocodingSearch({ lat, lon }: { lat: number, lon: number }): Promise<ReverseGeocodingJSON> {
  return await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
    headers: {
      Referer: 'https://norra.fr'
    }
  })).json() as unknown as ReverseGeocodingJSON
}

async function getMapAnalysis(trkpts: Array<GPXTrkPart>): Promise<MapAnalysis> {
  if (trkpts.length < 2) {
    const center = {
      lon: parseFloat(trkpts[0].__ATTRIBUTE__lon),
      lat: parseFloat(trkpts[0].__ATTRIBUTE__lat)
    }
    const reverseGeocodingSearchResult = await reverseGeocodingSearch(center)

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
      center,
      reverseGeocodingSearchResult
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

  const turfCenterResult = turfCenter(turfPoints([
    [minLon, maxLat],
    [maxLon, minLat],
    [minLon, minLat],
    [maxLon, maxLat]
  ]))

  const center = {
    lon: turfCenterResult.geometry.coordinates[0],
    lat: turfCenterResult.geometry.coordinates[1]
  }

  const reverseGeocodingSearchResult = await reverseGeocodingSearch(center)

  return {
    reverseGeocodingSearchResult,
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
    center
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
  let maxSpeed = -1
  let minSpeed = -1
  let averageSpeed = -1
  let speedVariations = []

  if (trackHasTime(parsedFile)) {
    const speedAnalysis = getSpeedAnalysis(trkpts)
    maxSpeed = speedAnalysis.maxSpeed
    minSpeed = speedAnalysis.minSpeed
    averageSpeed = speedAnalysis.averageSpeed
    speedVariations = speedAnalysis.speedVariations
  }
  const { center, boundaries, reverseGeocodingSearchResult } = await getMapAnalysis(trkpts)

  return NextResponse.json(
    {
      name: parsedFile.gpx.trk.name,
      activity: parsedFile.gpx.trk.type,
      time: parsedFile.gpx.metadata?.time,
      map: {
        center,
        boundaries,
        reverseGeocodingSearchResult
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
      speed: trackHasTime(parsedFile) ? {
        maxSpeed,
        minSpeed,
        averageSpeed,
        speedVariations
      } : undefined
    },
    { status: 200 }
  )
}
