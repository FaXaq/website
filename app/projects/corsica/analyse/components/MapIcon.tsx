'use client'

import React, { useMemo } from 'react'
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

interface MapIconProps {
    type: 'start' | 'finish' | 'active',
    size: number,
    position: LatLngTuple
}

export default function MapIcon({ position }: MapIconProps) {
  const map = useMap()
  const zoom = map.getZoom()

  const colors = {
    white: theme.extend.colors['corsica-white'],
    start: theme.extend.colors['corsica-green'],
    finish: theme.extend.colors['corsica-red'],
    blue: theme.extend.colors['corsica-blue']
  }

  const size = useMemo(() => {
    return 800000 / Math.pow(2, zoom)
  }, [zoom])

  return <Circle center={position} radius={size} color={colors.blue} fillColor={colors.white} stroke={true} weight={2} fillOpacity={1} />
}
