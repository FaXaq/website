'use client'

import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { MapAnalysis } from '../../api/analyse/helpers/getMapAnalysis'
import { GPXTrkPart } from '../../api/helpers/parseActivity'
import dynamic from 'next/dynamic'

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

export default function MapAnnotations({ mapAnalysis, points, activePoint }: MapProps) {
  const map = useMap()

  useEffect(() => {
    map.fitBounds([
      [mapAnalysis.boundaries[0].lat, mapAnalysis.boundaries[0].lon],
      [mapAnalysis.boundaries[1].lat, mapAnalysis.boundaries[1].lon]
    ])
  }, [mapAnalysis])

  return <>
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
    <Polyline positions={...points.map(point => ([parseFloat(point.__ATTRIBUTE__lat), parseFloat(point.__ATTRIBUTE__lon)]))}/>
  </>
}
