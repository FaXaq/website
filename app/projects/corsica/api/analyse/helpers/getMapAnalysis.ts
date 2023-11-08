import { GPXTrkPart } from '../../helpers/parseActivity'
import reverseGeocodingSearch, { ReverseGeocodingJSON } from './reverseGeocodingSearch'

interface Coordinates {
  lon: number,
  lat: number
}

export interface MapAnalysis {
    center: Coordinates,
    boundaries: [
      Coordinates,
      Coordinates
    ],
    reverseGeocodingSearchResult?: ReverseGeocodingJSON
  }

export default async function getMapAnalysis(trkpts: Array<GPXTrkPart>): Promise<MapAnalysis> {
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

  const center = {
    lon: parseFloat(trkpts[0].__ATTRIBUTE__lon),
    lat: parseFloat(trkpts[0].__ATTRIBUTE__lat)
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
