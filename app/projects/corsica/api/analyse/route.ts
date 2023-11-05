import { NextRequest, NextResponse } from 'next/server'
import { getFilesFromRequest } from '../helpers/getFilesFromRequest'
import { GPXJson, GPXTrkPart, parseGPX } from '../helpers/parseActivity'
import { ApiError } from '../helpers/const'
import { ListBlobResult } from '@vercel/blob'
import listBlobs from './helpers/listBlobs'
import getDistanceVariations, { DistanceAnalysis } from './helpers/getDistanceVariations'
import getSpeedAnalysis, { SpeedAnalysis } from './helpers/getSpeedAnalysis'
import getMapAnalysis, { MapAnalysis } from './helpers/getMapAnalysis'
import getElevationVariations, { ElevationVariationAnalysis } from './helpers/getElevationVariations'
import { getfileUrlFromRequest } from '../helpers/getFileUrlFromRequest'

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

export async function POST(
  request: NextRequest
): Promise<NextResponse<Analysis | ApiError>> {
  const fileUrl = await getfileUrlFromRequest(request)
  let file
  if (fileUrl) {
    const downloadedFile = await fetch(fileUrl, { method: 'GET' })
    file = await downloadedFile.blob()
  } else {
  // Should be only one file, or if not, take the first one only anyway
    file = (await getFilesFromRequest(request))[0]
  }

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

export async function GET(): Promise<NextResponse<ListBlobResult>> {
  return NextResponse.json(await listBlobs(), { status: 200 })
}
