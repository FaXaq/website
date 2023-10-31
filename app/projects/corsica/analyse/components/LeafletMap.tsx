import dynamic from 'next/dynamic'
import React from 'react'
import { MapContainerProps } from 'react-leaflet'

interface LeafletMapProps extends MapContainerProps {

}

const LazyMapContainer = dynamic(
  async () => ((await import('react-leaflet')).MapContainer),
  {
    ssr: false,
    loading: () => (<div className="w-full h-full" />)
  }
)

function LeafletMap({ children, ...props }: LeafletMapProps) {
  return <LazyMapContainer {...props}>
    {children}
  </LazyMapContainer>
}

export default LeafletMap
