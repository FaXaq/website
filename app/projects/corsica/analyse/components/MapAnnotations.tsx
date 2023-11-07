'use client'

import React, { useEffect, useMemo } from 'react'
import { useMap } from 'react-leaflet'
import { MapAnalysis } from '../../api/analyse/helpers/getMapAnalysis'
import { GPXTrkPart } from '../../api/helpers/parseActivity'
import dynamic from 'next/dynamic'
import { useActiveChartPoint } from '../Context/ActiveChartPoint'
import 'leaflet/dist/leaflet.css'
import MapIcon from './MapIcon'

const Polyline = dynamic(
  async () => (await import('react-leaflet')).Polyline,
  {
    ssr: false
  }
)

const TileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  {
    ssr: false
  }
)

interface MapProps {
    mapAnalysis: MapAnalysis,
    points: Array<GPXTrkPart>,
    activePoint: number | void
}

export default function MapAnnotations({ mapAnalysis, points }: MapProps) {
  const map = useMap()
  const { activePoint } = useActiveChartPoint()

  useEffect(() => {
    map.fitBounds([
      [mapAnalysis.boundaries[0].lat, mapAnalysis.boundaries[0].lon],
      [mapAnalysis.boundaries[1].lat, mapAnalysis.boundaries[1].lon]
    ])
  }, [mapAnalysis])

  const activePointCoordinates: [number, number] = useMemo(() => {
    if (activePoint.index === -1) {
      return [0, 0]
    }

    return [
      parseFloat(points[activePoint.index].__ATTRIBUTE__lat),
      parseFloat(points[activePoint.index].__ATTRIBUTE__lon)
    ]
  }, [activePoint.index])

  return <>
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
    { activePoint.index > -1 && (
      <MapIcon size={10000 - (9100 * Math.log10(map.getZoom()))} type='active' position={activePointCoordinates}/>
    )}
    <Polyline positions={...points.map(point => ([parseFloat(point.__ATTRIBUTE__lat), parseFloat(point.__ATTRIBUTE__lon)]))}/>
  </>
}
