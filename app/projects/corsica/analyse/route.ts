import { NextRequest, NextResponse } from 'next/server'
import { getFilesFromRequest } from '../helpers/api/getFilesFromRequest'
import { GPXTrkPart, parseGPX } from '../helpers/api/parseGPX'
import { ApiError } from '../helpers/api/const'

interface ElevationVariation {
    totalElevationGain: number,
    totalElevationLoss: number,
    elevationVariation: number
}

export interface Analysis {
    elevation: ElevationVariation
}

function getElevationVariations(trkpts: Array<GPXTrkPart>): ElevationVariation {
  if (trkpts.length < 2) {
    return {
      totalElevationGain: 0,
      totalElevationLoss: 0,
      elevationVariation: 0
    }
  }

  let totalElevationGain = 0
  let totalElevationLoss = 0
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
  }

  return {
    totalElevationGain,
    totalElevationLoss,
    elevationVariation: trkpts[trkpts.length - 1].ele - trkpts[0].ele
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

  const { totalElevationGain, totalElevationLoss, elevationVariation } = getElevationVariations(trkpts)

  return NextResponse.json(
    {
      elevation:
        {
          totalElevationGain,
          totalElevationLoss,
          elevationVariation
        }
    },
    { status: 200 }
  )
}
