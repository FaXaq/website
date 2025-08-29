
"use client"

import { MapContainer, MapContainerProps } from "react-leaflet";

const Map = ({ children, ...props}: MapContainerProps) => {
  return (
    <MapContainer {...props}>
      {children}
    </MapContainer>
  )
}

export default Map