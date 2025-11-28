'use client';

import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';

import { theme } from '@/components/ui/theme';

import type { GPXTrkPart, MapAnalysis } from '../../types';
import { useActiveChartPoint } from '../context/ActiveChartPoint';
import MapIcon from './MapIcon';

const Polyline = dynamic(
  async () => (await import('react-leaflet')).Polyline,
  {
    ssr: false
  }
);

const TileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  {
    ssr: false
  }
);

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
    map.fitBounds([
      [mapAnalysis.boundaries[0].lat, mapAnalysis.boundaries[0].lon],
      [mapAnalysis.boundaries[1].lat, mapAnalysis.boundaries[1].lon]
    ]);
  }, [mapAnalysis]);

  const activePointCoordinates: [number, number] = useMemo(() => {
    if (activePoint.index === -1) {
      return [0, 0];
    }

    return [
      parseFloat(points[activePoint.index].__ATTRIBUTE__lat),
      parseFloat(points[activePoint.index].__ATTRIBUTE__lon)
    ];
  }, [activePoint.index]);

  return <>
    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
    <Polyline positions={points.map(point => pointToLatLng(point))} color={theme.colors['corsica-red']}/>
    <MapIcon type="start" position={pointToLatLng(points[0])} />
    { activePoint.index > -1 && (
      <MapIcon type='active' position={activePointCoordinates} />
    )}
    <MapIcon type="start" position={pointToLatLng(points[0])} />
    <MapIcon type="end" position={pointToLatLng(points[points.length - 1])} />
  </>;
}
