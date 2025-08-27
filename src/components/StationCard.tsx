import React from 'react';
import { Station } from '../types/nrel';
import { clsx } from 'clsx';

export interface StationCardProps {
  station: Station;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function StationCard({ station, isSelected, onClick, className }: StationCardProps) {
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

  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'ELEC':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'CNG':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'HY':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={clsx(
        'charger-finder__station-card',
        isSelected && 'selected',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Select ${station.name} charging station`}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="charger-finder__station-name truncate">
              {station.name}
            </h3>
            <p className="charger-finder__station-address text-sm">
              {station.address.full}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {getFuelTypeIcon(station.fuelType)}
            <span className={`text-xs font-medium ${getStatusColor(station.status)}`}>
              {getStatusText(station.status)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="charger-finder__station-details">
          <div className="flex items-center gap-4 text-sm">
            {/* Distance */}
            {station.distance && (
              <span className="charger-finder__station-distance">
                {formatDistance(station.distance)} away
              </span>
            )}

            {/* Network */}
            {station.network && (
              <span className="text-cevs-muted">
                {station.network}
              </span>
            )}
          </div>
        </div>

        {/* Connector Types */}
        {station.connectorTypes.length > 0 && (
          <div className="charger-finder__station-connectors">
            {station.connectorTypes.slice(0, 3).map((connector) => (
              <span
                key={connector}
                className="charger-finder__connector-tag"
              >
                {connector}
              </span>
            ))}
            {station.connectorTypes.length > 3 && (
              <span className="charger-finder__connector-tag">
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

        {/* Hours and Pricing */}
        <div className="text-xs text-cevs-muted space-y-1">
          {station.access.daysTime && (
            <p>Hours: {station.access.daysTime}</p>
          )}
          {station.pricing && (
            <p>Pricing: {station.pricing}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <a
            href={getDirectionsUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-1.5 text-xs bg-cevs-accent text-white rounded hover:bg-cevs-accent-hover transition-colors text-center"
            onClick={(e) => e.stopPropagation()}
          >
            Google Maps
          </a>
          <a
            href={getAppleMapsUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-1.5 text-xs bg-cevs-accent text-white rounded hover:bg-cevs-accent-hover transition-colors text-center"
            onClick={(e) => e.stopPropagation()}
          >
            Apple Maps
          </a>
        </div>
      </div>
    </div>
  );
}
