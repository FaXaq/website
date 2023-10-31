import { XMLParser } from 'fast-xml-parser'
import { XML_ATTRIBUTE_PREFIX } from './const'

interface TCXTrackPoint {
  Time: string,
  Position: {
    LatitudeDegrees: number,
    LongitudeDegrees: number
  },
  AltitudeMeters: number,
  DistanceMeters: number,
  Extensions: {
    'ns3:TPX': {
      'ns3:Speed': number
    }
  }
}

interface TCXLap {
  '__ATTRIBUTE__StartTime': string,
  TotalTimeSeconds: number,
  DistanceMeters: number,
  MaximumSpeed: number,
  Calorie: number,
  Intensity: string
  TriggerMethod: string,
  Track: Array<TCXTrackPoint>
}

interface TCXJson {
  '?xml': {
    version: string,
    encoding: string
  },
  TrainingCenterDatabase: {
    'xsi:schemaLocation': string,
    '__ATTRIBUTE__xmlns:ns5': string,
    '__ATTRIBUTE__xmlns:ns3': string,
    '__ATTRIBUTE__xmlns:ns2': string,
    '__ATTRIBUTE__xmlns': string,
    '__ATTRIBUTE__xmlns:xsi': string,
    '__ATTRIBUTE__xmlns:ns4': string,
    Activities: {
      Activity: {
        '__ATTRIBUTE__Sport': string,
        Id: string,
        Lap: Array<TCXLap>
      }
    }
  }
}

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

export async function parseGPX(file: File): Promise<GPXJson> {
  const text = await file.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  })

  return parser.parse(text) as GPXJson
}

export async function parseTCX(file: File): Promise<TCXJson> {
  const text = await file.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: XML_ATTRIBUTE_PREFIX
  })

  return parser.parse(text) as TCXJson
}
