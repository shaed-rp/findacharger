import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Station } from '../../types/nrel';

export interface StationMarkerProps {
  station: Station;
  isSelected: boolean;
  onClick: () => void;
}

// Create custom marker icons
const createMarkerIcon = (isSelected: boolean, fuelType: string) => {
  const size = isSelected ? 32 : 24;
  const color = isSelected ? '#dc2626' : '#2563eb';
  
  // Different colors for different fuel types
  let markerColor = color;
  if (fuelType === 'ELEC') {
    markerColor = isSelected ? '#dc2626' : '#2563eb';
  } else if (fuelType === 'CNG') {
    markerColor = isSelected ? '#dc2626' : '#059669';
  } else if (fuelType === 'HY') {
    markerColor = isSelected ? '#dc2626' : '#7c3aed';
  }

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${markerColor}" stroke="white" stroke-width="2"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white"/>
    </svg>
  `;

  return new DivIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
  });
};

export function StationMarker({ station, isSelected, onClick }: StationMarkerProps) {
  const icon = useMemo(() => createMarkerIcon(isSelected, station.fuelType), [isSelected, station.fuelType]);

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return distance < 1 ? `${(distance * 5280).toFixed(0)}ft` : `${distance.toFixed(1)}mi`;
  };

  const getStatusColor = (status: Station['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'unavailable':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: Station['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const getDirectionsUrl = (station: Station) => {
    const { lat, lng } = station.location;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const getAppleMapsUrl = (station: Station) => {
    const { lat, lng } = station.location;
    return `http://maps.apple.com/?daddr=${lat},${lng}`;
  };

  return (
    <Marker
      position={[station.location.lat, station.location.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="charger-finder__marker-popup min-w-[200px]">
          <div className="space-y-2">
            {/* Station Name */}
            <h3 className="font-semibold text-cevs-fg text-sm">
              {station.name}
            </h3>

            {/* Address */}
            <p className="text-xs text-cevs-muted">
              {station.address.full}
            </p>

            {/* Distance */}
            {station.distance && (
              <p className="text-xs text-cevs-accent font-medium">
                {formatDistance(station.distance)} away
              </p>
            )}

            {/* Status */}
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${getStatusColor(station.status)}`}>
                {getStatusText(station.status)}
              </span>
            </div>

            {/* Network */}
            {station.network && (
              <p className="text-xs text-cevs-muted">
                Network: {station.network}
              </p>
            )}

            {/* Connector Types */}
            {station.connectorTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {station.connectorTypes.slice(0, 3).map((connector) => (
                  <span
                    key={connector}
                    className="px-1 py-0.5 text-xs bg-cevs-bg-secondary text-cevs-muted rounded"
                  >
                    {connector}
                  </span>
                ))}
                {station.connectorTypes.length > 3 && (
                  <span className="px-1 py-0.5 text-xs bg-cevs-bg-secondary text-cevs-muted rounded">
                    +{station.connectorTypes.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* EVSE Counts */}
            {Object.values(station.evseCounts).some(count => count && count > 0) && (
              <div className="text-xs text-cevs-muted">
                {station.evseCounts.dcFast && (
                  <span className="mr-2">DC Fast: {station.evseCounts.dcFast}</span>
                )}
                {station.evseCounts.level2 && (
                  <span className="mr-2">Level 2: {station.evseCounts.level2}</span>
                )}
                {station.evseCounts.level1 && (
                  <span>Level 1: {station.evseCounts.level1}</span>
                )}
              </div>
            )}

            {/* Hours */}
            {station.access.daysTime && (
              <p className="text-xs text-cevs-muted">
                Hours: {station.access.daysTime}
              </p>
            )}

            {/* Pricing */}
            {station.pricing && (
              <p className="text-xs text-cevs-muted">
                Pricing: {station.pricing}
              </p>
            )}

            {/* Directions Buttons */}
            <div className="flex gap-1 pt-2">
              <a
                href={getDirectionsUrl(station)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 text-xs bg-cevs-accent text-white rounded hover:bg-cevs-accent-hover transition-colors text-center"
              >
                Google Maps
              </a>
              <a
                href={getAppleMapsUrl(station)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 text-xs bg-cevs-accent text-white rounded hover:bg-cevs-accent-hover transition-colors text-center"
              >
                Apple Maps
              </a>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
