import { ListBlobResult } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '../helpers/const'
import { getfileUrlFromRequest } from '../helpers/getFileUrlFromRequest'
import { getFilesFromRequest } from '../helpers/getFilesFromRequest'
import { GPXJson, GPXTrkPart, parseGPX } from '../helpers/parseActivity'
import getDistanceVariations, { DistanceAnalysis } from './helpers/getDistanceVariations'
import getElevationVariations, { ElevationVariationAnalysis } from './helpers/getElevationVariations'
import getMapAnalysis, { MapAnalysis } from './helpers/getMapAnalysis'
import getSpeedAnalysis, { SpeedAnalysis } from './helpers/getSpeedAnalysis'
import getTimeAnalysis, { TimeAnalysis } from './helpers/getTimeAnalysis'
import listBlobs from './helpers/listBlobs'

export interface Analysis {
  name: string,
  activity: string,
  time: TimeAnalysis | void,
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
  const formData = await request.formData()
  const fileUrl = getfileUrlFromRequest(formData)
  let file

  if (fileUrl) {
    const downloadedFile = await fetch(fileUrl, { method: 'GET' })
    file = await downloadedFile.blob()
  } else {
  // Should be only one file, or if not, take the first one only anyway
    file = (await getFilesFromRequest(formData))[0]
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

  const elevationAnalysis = getElevationVariations(trkpts)
  const distanceAnalysis = getDistanceVariations(trkpts)
  let speedAnalysis: SpeedAnalysis | void
  let timeAnalysis: TimeAnalysis | void

  if (trackHasTime(parsedFile)) {
    timeAnalysis = getTimeAnalysis(parsedFile)
    speedAnalysis = getSpeedAnalysis(trkpts)
  }
  const mapAnalysis = await getMapAnalysis(trkpts)

  return NextResponse.json(
    {
      name: parsedFile.gpx.trk.name,
      activity: parsedFile.gpx.trk.type,
      time: timeAnalysis,
      map: mapAnalysis,
      elevation: elevationAnalysis,
      distance: distanceAnalysis,
      points: [
        ...trkpts
      ],
      speed: speedAnalysis
    },
    { status: 200 }
  )
}

export async function GET(): Promise<NextResponse<ListBlobResult>> {
  return NextResponse.json(await listBlobs(), { status: 200 })
}
