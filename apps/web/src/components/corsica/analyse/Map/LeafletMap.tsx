import type { MapContainerProps } from "react-leaflet";
import { MapContainer } from "react-leaflet";

const Map = ({ children, ...props}: MapContainerProps) => {
  return (
    <MapContainer {...props}>
      {children}
    </MapContainer>
  );
};

export default Map;