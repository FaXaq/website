'use client';

import type { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

import { theme } from '@/components/ui/theme';

const Circle = dynamic(
  async () => (await import('react-leaflet')).Circle,
  {
    ssr: false
  }
);

type MapIconType = 'start' | 'end' | 'active'

interface MapIconProps {
    type: MapIconType,
    position: LatLngTuple
}

export default function MapIcon({ type, position }: MapIconProps) {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom() || 0);

  map.on('zoomend', () => {
    setZoom(map.getZoom());
  });

  const size = 800000 / Math.pow(2, 0 + zoom);

  // eslint-disable-next-line no-unused-vars
  const color: { [key in MapIconType]: { color: string, fillColor: string } } = {
    start: {
      color: theme.colors['corsica-green'],
      fillColor: theme.colors['corsica-green']
    },
    end: {
      color: theme.colors['corsica-olive'],
      fillColor: theme.colors['corsica-olive']
    },
    active: {
      color: theme.colors['corsica-white'],
      fillColor: theme.colors['corsica-blue']
    }
  };

  return <Circle center={position} radius={size} color={color[type].color} fillColor={color[type].fillColor} stroke={true} weight={2} fillOpacity={1} />;
}
