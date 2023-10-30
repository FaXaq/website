'use client'

import React, { useEffect } from 'react'
import { useMap, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import { MapAnalysis } from '../analyse/route'
import { GPXTrkPart } from '../helpers/api/parseActivity'

interface MapProps {
    mapAnalysis: MapAnalysis,
    points: Array<GPXTrkPart>,
    activePoint: number | void
}

function Map({ mapAnalysis, points, activePoint }: MapProps) {
  const map = useMap()
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  useEffect(() => {
    map.fitBounds([
      [mapAnalysis.boundaries[0].lat, mapAnalysis.boundaries[0].lon],
      [mapAnalysis.boundaries[1].lat, mapAnalysis.boundaries[1].lon]
    ])
  }, [mapAnalysis])

  const zoom = map.getZoom()

  return <>
    {activePoint && <Circle center={[parseFloat(points[activePoint].__ATTRIBUTE__lat), parseFloat(points[activePoint].__ATTRIBUTE__lon)]} radius={10000 / zoom} /> }
    <Polyline positions={...points.map(point => ([parseFloat(point.__ATTRIBUTE__lat), parseFloat(point.__ATTRIBUTE__lon)]))}/>
  </>
}

export default Map
