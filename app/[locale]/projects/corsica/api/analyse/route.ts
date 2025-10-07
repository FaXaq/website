import { ListBlobResult } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getfileUrlFromRequest } from '../helpers/getFileUrlFromRequest'
import { getFilesFromRequest } from '../helpers/getFilesFromRequest'
import { parseGPX } from '../helpers/parseActivity'
import getDistanceVariations from './helpers/getDistanceVariations'
import getElevationVariations from './helpers/getElevationVariations'
import getMapAnalysis from './helpers/getMapAnalysis'
import getSpeedAnalysis from './helpers/getSpeedAnalysis'
import { ApiError } from '../../const'
import { Analysis, GPXJson, GPXTrkPart, SpeedAnalysis, TimeAnalysis } from '../../analyse/types'
import getTimeAnalysis from './helpers/getTimeAnalysis'

function trackHasTime(file: GPXJson): boolean {
  return !!file.gpx.metadata?.time
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<Analysis | ApiError>> {
  const formData = await request.formData()
  const fileUrl = getfileUrlFromRequest(formData)
  let file: File

  if (fileUrl) {
    const downloadedFile = await fetch(fileUrl, { method: 'GET' })
    file = await downloadedFile.blob() as File
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