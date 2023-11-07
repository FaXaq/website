'use client'

import React, { useState } from 'react'
import { theme } from '../../../../../tailwind.config'
import { LatLngTuple } from 'leaflet'
import { useMap } from 'react-leaflet'
import dynamic from 'next/dynamic'

const Circle = dynamic(
  async () => (await import('react-leaflet')).Circle,
  {
    ssr: false
  }
)

type MapIconType = 'start' | 'end' | 'active'

interface MapIconProps {
    type: MapIconType,
    position: LatLngTuple
}

export default function MapIcon({ type, position }: MapIconProps) {
  const map = useMap()
  const [zoom, setZoom] = useState<number>(map.getZoom() || 0)

  map.on('zoomend', () => {
    setZoom(map.getZoom())
  })

  const size = 800000 / Math.pow(2, 0 + zoom)

  // eslint-disable-next-line no-unused-vars
  const color: { [key in MapIconType]: { color: string, fillColor: string } } = {
    start: {
      color: theme.extend.colors['corsica-green'],
      fillColor: theme.extend.colors['corsica-green']
    },
    end: {
      color: theme.extend.colors['corsica-olive'],
      fillColor: theme.extend.colors['corsica-olive']
    },
    active: {
      color: theme.extend.colors['corsica-white'],
      fillColor: theme.extend.colors['corsica-blue']
    }
  }

  return <Circle center={position} radius={size} color={color[type].color} fillColor={color[type].fillColor} stroke={true} weight={2} fillOpacity={1} />
}
