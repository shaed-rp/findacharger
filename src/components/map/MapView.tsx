import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Station } from '../../types/nrel';
import { StationMarker } from './StationMarker';
import { clsx } from 'clsx';

export interface MapViewProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: string | number;
}

// Component to handle map center updates
function MapCenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, map]);
  
  return null;
}

// Component to handle station selection
function StationMarkers({
  stations,
  selectedStation,
  onStationSelect,
}: {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
}) {
  return (
    <>
      {stations.map((station) => (
        <StationMarker
          key={station.id}
          station={station}
          isSelected={selectedStation?.id === station.id}
          onClick={() => onStationSelect(station)}
        />
      ))}
    </>
  );
}

export function MapView({
  stations,
  selectedStation,
  onStationSelect,
  center,
  zoom = 12,
  className,
  height = '400px',
}: MapViewProps) {
  const mapCenter: LatLngExpression = useMemo(() => [center.lat, center.lng], [center.lat, center.lng]);



  return (
    <div 
      className={clsx('charger-finder__map', className)}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
        className="charger-finder__map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter center={center} />
        
        <StationMarkers
          stations={stations}
          selectedStation={selectedStation}
          onStationSelect={onStationSelect}
        />
        
        {/* Attribution footer */}
        <div className="leaflet-control-attribution leaflet-control">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            © OpenStreetMap contributors
          </a>
          {' | '}
          <a href="https://developer.nrel.gov/" target="_blank" rel="noopener noreferrer">
            Data from NREL
          </a>
        </div>
      </MapContainer>
    </div>
  );
}
