// Main component exports
export { ChargerFinder } from './components/ChargerFinder';
export type { ChargerFinderProps } from './types/nrel';

// Hook exports
export { useChargerSearch, useFuelTypes, useConnectorTypes, useChargerSearchPaginated, useInfiniteChargerSearch } from './hooks/useChargerSearch';
export { useGeolocation, useLocationWatcher } from './hooks/useGeolocation';

// Type exports
export type {
  Station,
  SearchParams,
  FilterOptions,
  ViewMode,
  Theme,
  FuelType,
  ConnectorType,
  GeolocationPosition,
  GeolocationError,
  APIError,
  DistanceResult,
} from './types/nrel';

// Service exports
export { NRELService } from './lib/nrel';
export { GeocodingService } from './lib/geocode';
export { fetchWithRetry, fetchJson, createUrl } from './lib/fetcher';
export { getEnvConfig, isValidApiKey, maskApiKey } from './lib/env';

// Utility exports
export { FUEL_TYPES, CONNECTOR_TYPES } from './types/nrel';

// CSS exports (for manual import if needed)
export const styles = './styles.css';
export const theme = './theme.css';
