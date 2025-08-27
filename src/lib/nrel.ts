import { z } from 'zod';
import { fetchJson, createUrl } from './fetcher';
import { getEnvConfig } from './env';
import { 
  NRELResponseSchema, 
  NRELStationSchema, 
  Station, 
  SearchParams,
  FUEL_TYPES,
  CONNECTOR_TYPES 
} from '../types/nrel';

/**
 * NREL API service for fetching charging stations
 */
export class NRELService {
  private config: ReturnType<typeof getEnvConfig>;

  constructor(overrides?: Parameters<typeof getEnvConfig>[0]) {
    this.config = getEnvConfig(overrides);
  }

  /**
   * Build NREL API query parameters
   */
  private buildQueryParams(params: SearchParams): Record<string, any> {
    const queryParams: Record<string, any> = {
      api_key: this.config.nrelApiKey,
      latitude: params.location.lat,
      longitude: params.location.lng,
      radius: params.radius,
      format: 'json',
    };

    // Add fuel type filter if specified
    if (params.fuelTypes && params.fuelTypes.length > 0) {
      queryParams.fuel_type = params.fuelTypes.join(',');
    }

    // Add limit and offset for pagination
    if (params.limit) {
      queryParams.limit = params.limit;
    }
    if (params.offset) {
      queryParams.offset = params.offset;
    }

    return queryParams;
  }

  /**
   * Transform NREL station data to internal Station format
   */
  private transformStation(nrelStation: z.infer<typeof NRELStationSchema>, searchLocation?: { lat: number; lng: number }): Station {
    // Calculate distance if search location is provided
    let distance: number | undefined;
    if (searchLocation) {
      distance = this.calculateDistance(
        searchLocation.lat,
        searchLocation.lng,
        nrelStation.latitude,
        nrelStation.longitude
      );
    }

    // Parse EVSE counts
    const evseCounts = {
      level1: nrelStation.ev_level1_evse_num ? 
        (typeof nrelStation.ev_level1_evse_num === 'string' ? parseInt(nrelStation.ev_level1_evse_num, 10) : nrelStation.ev_level1_evse_num) : 
        undefined,
      level2: nrelStation.ev_level2_evse_num ? 
        (typeof nrelStation.ev_level2_evse_num === 'string' ? parseInt(nrelStation.ev_level2_evse_num, 10) : nrelStation.ev_level2_evse_num) : 
        undefined,
      dcFast: nrelStation.ev_dc_fast_num ? 
        (typeof nrelStation.ev_dc_fast_num === 'string' ? parseInt(nrelStation.ev_dc_fast_num, 10) : nrelStation.ev_dc_fast_num) : 
        undefined,
      other: nrelStation.ev_other_evse ? 
        (typeof nrelStation.ev_other_evse === 'string' ? parseInt(nrelStation.ev_other_evse, 10) : undefined) : 
        undefined,
    };

    // Determine status
    let status: Station['status'] = 'unknown';
    if (nrelStation.status_code) {
      switch (nrelStation.status_code.toUpperCase()) {
        case 'E':
        case 'A':
          status = 'available';
          break;
        case 'P':
        case 'T':
          status = 'unavailable';
          break;
        default:
          status = 'unknown';
      }
    }

    // Parse connector types
    const connectorTypes = nrelStation.ev_connector_types || [];

    return {
      id: nrelStation.id,
      name: nrelStation.station_name,
      fuelType: nrelStation.fuel_type_code,
      status,
      network: nrelStation.ev_network || undefined,
      connectorTypes,
      location: {
        lat: nrelStation.latitude,
        lng: nrelStation.longitude,
      },
      address: {
        street: nrelStation.street_address,
        city: nrelStation.city,
        state: nrelStation.state,
        zip: nrelStation.zip,
        full: `${nrelStation.street_address}, ${nrelStation.city}, ${nrelStation.state} ${nrelStation.zip}`,
      },
      access: {
        daysTime: nrelStation.access_days_time || undefined,
        code: nrelStation.access_code || undefined,
        detailCode: nrelStation.access_detail_code || undefined,
      },
      pricing: nrelStation.ev_pricing || undefined,
      phone: nrelStation.station_phone || undefined,
      website: nrelStation.ev_network_web || undefined,
      distance,
      evseCounts,
    };
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
   * Fetch stations from NREL API
   */
  async fetchStations(params: SearchParams): Promise<Station[]> {
    try {
      const queryParams = this.buildQueryParams(params);
      const url = createUrl(this.config.nrelBaseUrl, queryParams);
      
      const response = await fetchJson<z.infer<typeof NRELResponseSchema>>(url);
      
      // Validate response with Zod
      const validatedResponse = NRELResponseSchema.parse(response);
      
      // Transform stations
      const stations = validatedResponse.fuel_stations.map(station =>
        this.transformStation(station, params.location)
      );
      
      // Sort by distance if available
      if (stations.some(s => s.distance !== undefined)) {
        stations.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          return distA - distB;
        });
      }
      
      return stations;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid API response: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get available fuel types
   */
  getFuelTypes(): Record<string, string> {
    return FUEL_TYPES;
  }

  /**
   * Get available connector types
   */
  getConnectorTypes(): Record<string, string> {
    return CONNECTOR_TYPES;
  }

  /**
   * Validate search parameters
   */
  validateSearchParams(params: SearchParams): string[] {
    const errors: string[] = [];

    if (!params.location || typeof params.location.lat !== 'number' || typeof params.location.lng !== 'number') {
      errors.push('Valid location with latitude and longitude is required');
    }

    if (params.location?.lat < -90 || params.location?.lat > 90) {
      errors.push('Latitude must be between -90 and 90');
    }

    if (params.location?.lng < -180 || params.location?.lng > 180) {
      errors.push('Longitude must be between -180 and 180');
    }

    if (params.radius < 0 || params.radius > 500) {
      errors.push('Radius must be between 0 and 500 miles');
    }

    if (params.fuelTypes && !Array.isArray(params.fuelTypes)) {
      errors.push('Fuel types must be an array');
    }

    return errors;
  }
}
