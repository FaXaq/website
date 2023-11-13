import { XMLParser } from 'fast-xml-parser'
import { XML_ATTRIBUTE_PREFIX } from './const'

export interface GPXTrkPart {
  __ATTRIBUTE__lat: string,
  __ATTRIBUTE__lon: string,
  ele: number,
  time?: string
}

export interface GPXJson {
    '?xml': {
        __ATTRIBUTE__version: string,
        __ATTRIBUTE__encoding: string
    },
    gpx: {
        '__ATTRIBUTE__creator': string,
        '__ATTRIBUTE__xmlns:xsi': string,
        '__ATTRIBUTE__xsi:schemaLocation': string,
        '__ATTRIBUTE__version': string,
        '__ATTRIBUTE__xmlns': string
        metadata?: {
          time?: string
        },
        trk: {
          name: string,
          type: string,
          trkseg: {
              trkpt: Array<GPXTrkPart>
          }
        }
    }
}

export async function parseGPX(file: Blob): Promise<GPXJson> {
  const text = await file.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  })

  return parser.parse(text) as GPXJson
}
