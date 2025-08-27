import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GeocodingService } from '../lib/geocode';
import { useGeolocation } from '../hooks/useGeolocation';
import { clsx } from 'clsx';

export interface SearchBarProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  apiKey?: string;
  baseUrl?: string;
}

export function SearchBar({
  onLocationSelect,
  onSearch,
  placeholder = 'Enter address, city, or ZIP code...',
  className,
  disabled = false,
  apiKey,
  baseUrl,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const geocodingService = new GeocodingService({ nrelApiKey: apiKey, nrelBaseUrl: baseUrl });

  const {
    location: currentLocation,
    loading: locationLoading,
    error: locationError,
    supported: locationSupported,
    requestLocation,
    clearError: clearLocationError,
  } = useGeolocation({ apiKey, baseUrl });

  // Handle geolocation success
  useEffect(() => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
      setQuery('Current Location');
    }
  }, [currentLocation, onLocationSelect]);

  // Handle geolocation error
  useEffect(() => {
    if (locationError) {
      setError(locationError);
    }
  }, [locationError]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null);
    clearLocationError();
  }, [clearLocationError]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSearch();
    }
  }, [query]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsGeocoding(true);
    setError(null);

    try {
      const location = await geocodingService.geocodeAddress(query.trim());
      onLocationSelect(location);
      onSearch(query.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to geocode address');
    } finally {
      setIsGeocoding(false);
    }
  }, [query, geocodingService, onLocationSelect, onSearch]);

  const handleUseMyLocation = useCallback(async () => {
    setError(null);
    clearLocationError();
    setQuery('Getting location...');
    await requestLocation();
  }, [requestLocation, clearLocationError]);

  const handleClear = useCallback(() => {
    setQuery('');
    setError(null);
    clearLocationError();
    inputRef.current?.focus();
  }, [clearLocationError]);

  return (
    <div className={clsx('charger-finder__search', className)}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              disabled={disabled || locationLoading}
              className="charger-finder__search-input"
              aria-label="Search for charging stations by location"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cevs-muted hover:text-cevs-fg"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={disabled || !query.trim() || isGeocoding}
            className="charger-finder__search-button disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search for charging stations"
          >
            {isGeocoding ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>

        {locationSupported && (
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={disabled || locationLoading}
            className="flex items-center gap-2 text-sm text-cevs-accent hover:text-cevs-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Use my current location"
          >
            {locationLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {locationLoading ? 'Getting location...' : 'Use my location'}
          </button>
        )}

        {error && (
          <div className="text-sm text-cevs-error" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
