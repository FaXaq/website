import 'leaflet/dist/leaflet.css';

import type { GPXTrkPart, MapAnalysis } from '@repo/schemas/api/procedures/corsica';
import React, { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { Polyline, TileLayer } from 'react-leaflet';

import { theme } from '@/components/ui/theme';

import { useActiveChartPoint } from './context/ActiveChartPoint';
import MapIcon from './MapIcon';


interface MapProps {
    mapAnalysis: MapAnalysis,
    points: Array<GPXTrkPart>,
}

function pointToLatLng(point: GPXTrkPart): [number, number] {
  return [parseFloat(point.__ATTRIBUTE__lat), parseFloat(point.__ATTRIBUTE__lon)];
}

export default function MapAnnotations({ mapAnalysis, points }: MapProps) {
  const map = useMap();
  const { activePoint } = useActiveChartPoint();

  useEffect(() => {
    // Should never happen
    if (!mapAnalysis.boundaries[0] || !mapAnalysis.boundaries[1]) {
      return;
    }

    map.fitBounds([
      [mapAnalysis.boundaries[0].lat, mapAnalysis.boundaries[0].lon],
      [mapAnalysis.boundaries[1].lat, mapAnalysis.boundaries[1].lon]
    ]);
  }, [mapAnalysis]);

  const activePointCoordinates: [number, number] = useMemo(() => {
    const index = activePoint.index;
    if (activePoint.index === -1 || !points[index]) {
      return [0, 0];
    }

    return [
      parseFloat(points[index].__ATTRIBUTE__lat),
      parseFloat(points[index].__ATTRIBUTE__lon)
    ];
  }, [activePoint.index]);

  const lastIndex = points.length - 1;

  if (!points[0] || !points[lastIndex]) {
    return null;
  }

  return <>
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
    <Polyline positions={points.map(point => pointToLatLng(point))} color={theme.colors['corsica-red']}/>
    <MapIcon type="start" position={pointToLatLng(points[0])} />
    { activePoint.index > -1 && (
      <MapIcon type='active' position={activePointCoordinates} />
    )}
    <MapIcon type="start" position={pointToLatLng(points[0])} />
    <MapIcon type="end" position={pointToLatLng(points[lastIndex])} />
  </>;
}
