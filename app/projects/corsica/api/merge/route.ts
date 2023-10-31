import { NextRequest, NextResponse } from 'next/server'
import { XMLBuilder } from 'fast-xml-parser'
import { getFilesFromRequest } from '../helpers/getFilesFromRequest'
import { parseGPX } from '../helpers/parseActivity'
import { XML_ATTRIBUTE_PREFIX } from '../helpers/const'

export async function POST(
  request: NextRequest
) {
  const files = await getFilesFromRequest(request)
  const parsedFiles = await Promise.all(files.map(async (file) => parseGPX(file)))
  const sortedParsedFiles = parsedFiles
    .sort((a, b) => new Date(a.gpx.metadata.time).getTime() - new Date(b.gpx.metadata.time).getTime())

  const mergedFile = sortedParsedFiles[0]

  for (let i = 1; i < sortedParsedFiles.length; i++) {
    mergedFile.gpx.trk.trkseg.trkpt
      .push(...sortedParsedFiles[i].gpx.trk.trkseg.trkpt)
    mergedFile.gpx.trk.name += ` + ${sortedParsedFiles[i].gpx.trk.name}`
  }

  mergedFile.gpx.__ATTRIBUTE__creator = 'https://norra.fr/projects/corsica'

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  })

  return new NextResponse(
    new Blob([builder.build(mergedFile)], { type: 'application/octet-stream' }),
    { status: 200 }
  )
}
