export type ChartValue = number
export type ChartLabel = number

export type ChartData = Array<{
    value: ChartValue,
    label: ChartLabel,
    index: number
}>
export interface TimeAnalysis {
    meta: string,
    start: string,
    end: string,
    movingTimeVariations: Array<number>,
    totalMovingTime: number
}


interface Coordinates {
  lon: number,
  lat: number
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

export interface ReverseGeocodingJSON {
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
    reverseGeocodingSearchResult?: ReverseGeocodingJSON
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

export interface SpeedAnalysis {
  maxSpeed: number,
  minSpeed: number,
  averageSpeed: number,
  speedVariations: Array<number>
}
export interface DistanceAnalysis {
    totalDistance: number,
    distanceVariations: Array<number>
}
export interface ElevationVariation {
    elevationGain: number,
    elevationLoss: number,
    gradient: number
  }

export interface ElevationVariationAnalysis {
    totalElevationGain: number,
    totalElevationLoss: number,
    elevationVariations: Array<ElevationVariation>
}

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