import { useState, useEffect, useCallback } from 'react';
import { GeocodingService } from '../lib/geocode';
import { GeolocationPosition, GeolocationError } from '../types/nrel';

export interface GeolocationState {
  location: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
}

export interface UseGeolocationOptions {
  apiKey?: string;
  baseUrl?: string;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

/**
 * Hook for browser geolocation with error handling and state management
 */
export function useGeolocation(options: UseGeolocationOptions = {}): {
  location: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
  requestLocation: () => Promise<void>;
  clearError: () => void;
} {
  const {
    apiKey,
    baseUrl,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    autoRequest = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    supported: typeof navigator !== 'undefined' && !!navigator.geolocation,
  });

  const geocodingService = new GeocodingService({ nrelApiKey: apiKey, nrelBaseUrl: baseUrl });

  const requestLocation = useCallback(async () => {
    if (!state.supported) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const location = await geocodingService.getCurrentLocation({
        enableHighAccuracy,
        timeout,
        maximumAge,
      });

      setState(prev => ({
        ...prev,
        location,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get location',
      }));
    }
  }, [state.supported, geocodingService, enableHighAccuracy, timeout, maximumAge]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Auto-request location if enabled
  useEffect(() => {
    if (autoRequest && state.supported && !state.location && !state.loading) {
      requestLocation();
    }
  }, [autoRequest, state.supported, state.location, state.loading, requestLocation]);

  return {
    location: state.location,
    loading: state.loading,
    error: state.error,
    supported: state.supported,
    requestLocation,
    clearError,
  };
}

/**
 * Hook for watching location changes
 */
export function useLocationWatcher(options: UseGeolocationOptions & { watchId?: number } = {}) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);

  const geocodingService = new GeocodingService({ 
    nrelApiKey: options.apiKey, 
    nrelBaseUrl: options.baseUrl 
  });

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setWatching(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setError(null);
      },
      (error: GeolocationError) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
          default:
            message = 'An unknown error occurred while watching location.';
        }
        setError(message);
        setWatching(false);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 300000,
      }
    );

    return watchId;
  }, [geocodingService, options.enableHighAccuracy, options.timeout, options.maximumAge]);

  const stopWatching = useCallback((watchId?: number) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
    setWatching(false);
  }, []);

  useEffect(() => {
    let watchId: number | undefined;

    if (options.autoRequest) {
      watchId = startWatching();
    }

    return () => {
      if (watchId) {
        stopWatching(watchId);
      }
    };
  }, [options.autoRequest, startWatching, stopWatching]);

  return {
    location,
    error,
    watching,
    startWatching,
    stopWatching,
  };
}
