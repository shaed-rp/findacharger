import { fetchJson, createUrl } from './fetcher';
import { getEnvConfig } from './env';

/**
 * Geocoding service using Nominatim and browser geolocation
 */
export class GeocodingService {
  private config: ReturnType<typeof getEnvConfig>;

  constructor(overrides?: Parameters<typeof getEnvConfig>[0]) {
    this.config = getEnvConfig(overrides);
  }

  /**
   * Geocode an address or place name to coordinates using Nominatim
   */
  async geocodeAddress(query: string): Promise<{ lat: number; lng: number }> {
    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    try {
      const params = {
        q: query,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      };

      const url = createUrl(this.config.nominatimBaseUrl, params);
      const results = await fetchJson<any[]>(url);

      if (!results || results.length === 0) {
        throw new Error(`No results found for "${query}"`);
      }

      const result = results[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates returned from geocoding service');
      }

      return { lat, lng };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Geocoding failed: ${error.message}`);
      }
      throw new Error('Geocoding failed with unknown error');
    }
  }

  /**
   * Get current location using browser geolocation API
   */
  async getCurrentLocation(options?: PositionOptions): Promise<{ lat: number; lng: number }> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options,
      };

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error: GeolocationPositionError) => {
          let message: string;
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              message = 'Location permission denied. Please enable location access.';
              break;
            case 2: // POSITION_UNAVAILABLE
              message = 'Location information is unavailable.';
              break;
            case 3: // TIMEOUT
              message = 'Location request timed out.';
              break;
            default:
              message = 'An unknown error occurred while getting location.';
          }
          reject(new Error(message));
        },
        defaultOptions
      );
    });
  }

  /**
   * Reverse geocode coordinates to address using Nominatim
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const params = {
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: 1,
      };

      const url = createUrl(this.config.nominatimBaseUrl.replace('/search', '/reverse'), params);
      const result = await fetchJson<any>(url);

      if (!result || !result.display_name) {
        throw new Error('No address found for the given coordinates');
      }

      return result.display_name;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Reverse geocoding failed: ${error.message}`);
      }
      throw new Error('Reverse geocoding failed with unknown error');
    }
  }

  /**
   * Validate coordinates
   */
  validateCoordinates(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat: number, lng: number, precision: number = 4): string {
    const latStr = lat.toFixed(precision);
    const lngStr = lng.toFixed(precision);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    
    return `${Math.abs(parseFloat(latStr))}°${latDir}, ${Math.abs(parseFloat(lngStr))}°${lngDir}`;
  }

  /**
   * Calculate distance between two coordinates in miles
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   */
  formatDistance(distance: number, unit: 'miles' | 'kilometers' = 'miles'): string {
    if (unit === 'kilometers') {
      const km = distance * 1.60934;
      return km < 1 ? `${(km * 1000).toFixed(0)}m` : `${km.toFixed(1)}km`;
    }
    
    return distance < 1 ? `${(distance * 5280).toFixed(0)}ft` : `${distance.toFixed(1)}mi`;
  }
}
