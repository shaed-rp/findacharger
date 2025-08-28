import { useState, useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { SearchBar } from './SearchBar';
import { Filters } from './Filters';
import { ViewToggle } from './ViewToggle';
import { MapView } from './map/MapView';
import { StationList } from './StationList';
import { useChargerSearch } from '../hooks/useChargerSearch';
import { 
  ChargerFinderProps, 
  SearchParams, 
  FilterOptions, 
  ViewMode, 
 
  Station 
} from '../types/nrel';

// Create a default query client
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function ChargerFinder({
  apiKey,
  baseUrl,
  initialLocation,
  defaultRadius = 25,
  defaultFuelTypes = ['ELEC'],
  defaultNetworks = [],
  defaultConnectorTypes = [],
  theme = 'auto',
  view = 'split',
  onStationSelect,
  onSearch,
  onError,
  className,
  style,
  queryClient = defaultQueryClient,
}: ChargerFinderProps & { queryClient?: QueryClient }) {
  console.log('ChargerFinder rendering with props:', { apiKey, theme, view, defaultRadius });
  // State management
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(view);
  const [filters, setFilters] = useState<FilterOptions>({
    radius: defaultRadius,
    fuelTypes: defaultFuelTypes,
    networks: defaultNetworks,
    connectorTypes: defaultConnectorTypes,
    openNow: false,
    unit: 'miles',
  });

  // Search parameters for API
  const searchParams = useMemo<SearchParams | null>(() => {
    if (!currentLocation) return null;
    
    return {
      location: currentLocation,
      radius: filters.radius,
      fuelTypes: filters.fuelTypes,
    };
  }, [currentLocation, filters.radius, filters.fuelTypes]);

  // Fetch stations using React Query
  const {
    data: stations = [],
    isLoading,
    error,
    refetch,
  } = useChargerSearch(searchParams, {
    apiKey,
    baseUrl,
  });

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Handle location selection
  const handleLocationSelect = useCallback((location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
    setSelectedStation(null);
  }, []);

  // Handle search
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = useCallback((_query: string) => {
    if (onSearch && currentLocation) {
      onSearch({
        location: currentLocation,
        radius: filters.radius,
        fuelTypes: filters.fuelTypes,
      });
    }
  }, [onSearch, currentLocation, filters.radius, filters.fuelTypes]);

  // Handle station selection
  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStation(station);
    if (onStationSelect) {
      onStationSelect(station);
    }
  }, [onStationSelect]);

  // Handle view change
  const handleViewChange = useCallback((newView: ViewMode) => {
    setCurrentView(newView);
    // Persist view preference in localStorage
    try {
      localStorage.setItem('@cevs/ci:view', newView);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Load persisted view preference
  useEffect(() => {
    try {
      const persistedView = localStorage.getItem('@cevs/ci:view') as ViewMode;
      if (persistedView && ['map', 'list', 'split'].includes(persistedView)) {
        setCurrentView(persistedView);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Filter stations based on current filters
  const filteredStations = useMemo(() => {
    let filtered = stations;

    // Filter by networks
    if (filters.networks.length > 0) {
      filtered = filtered.filter(station => 
        station.network && filters.networks.includes(station.network)
      );
    }

    // Filter by connector types
    if (filters.connectorTypes.length > 0) {
      filtered = filtered.filter(station =>
        station.connectorTypes.some(connector => 
          filters.connectorTypes.includes(connector)
        )
      );
    }

    // Filter by open now (basic heuristic)
    if (filters.openNow) {
      filtered = filtered.filter(station => {
        const hours = station.access.daysTime?.toLowerCase() || '';
        return !hours.includes('closed') && 
               !hours.includes('24 hours') && 
               hours.length > 0;
      });
    }

    return filtered;
  }, [stations, filters.networks, filters.connectorTypes, filters.openNow]);

  // Get unique networks and connectors from stations
  const availableNetworks = useMemo(() => {
    const networks = new Set<string>();
    stations.forEach(station => {
      if (station.network) {
        networks.add(station.network);
      }
    });
    return Array.from(networks).sort();
  }, [stations]);

  const availableConnectors = useMemo(() => {
    const connectors = new Set<string>();
    stations.forEach(station => {
      station.connectorTypes.forEach(connector => {
        connectors.add(connector);
      });
    });
    return Array.from(connectors).sort();
  }, [stations]);

  // Theme class
  const themeClass = useMemo(() => {
    return `cevs-theme-${theme}`;
  }, [theme]);

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <div
          className={clsx('charger-finder', themeClass, className)}
          style={style}
          role="region"
          aria-label="Charging station finder"
        >
        {/* Header */}
        <div className="charger-finder__header">
          <h2 className="charger-finder__title">Find EV Charging Stations</h2>
          <ViewToggle
            view={currentView}
            onViewChange={handleViewChange}
            disabled={isLoading}
          />
        </div>

        {/* Search Bar */}
        <SearchBar
          onLocationSelect={handleLocationSelect}
          onSearch={handleSearch}
          disabled={isLoading}
          apiKey={apiKey}
          baseUrl={baseUrl}
        />

        {/* Filters */}
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          disabled={isLoading}
          availableNetworks={availableNetworks}
          availableConnectors={availableConnectors}
        />

        {/* Results */}
        <div className="charger-finder__results">
          {isLoading && (
            <div className="charger-finder__loading">
              <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Finding charging stations...
            </div>
          )}

          {error && (
            <div className="charger-finder__error" role="alert">
              <p className="font-medium">Error loading stations</p>
              <p className="text-sm">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 px-3 py-1 text-sm bg-cevs-accent text-white rounded hover:bg-cevs-accent-hover transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className={`charger-finder__results--${currentView}`}>
              {/* Map View */}
              {(currentView === 'map' || currentView === 'split') && currentLocation && (
                <div className="charger-finder__map">
                  <MapView
                    stations={filteredStations}
                    selectedStation={selectedStation}
                    onStationSelect={handleStationSelect}
                    center={currentLocation}
                    height={currentView === 'split' ? '400px' : '600px'}
                  />
                </div>
              )}

              {/* List View */}
              {(currentView === 'list' || currentView === 'split') && (
                <div className="charger-finder__list">
                  <StationList
                    stations={filteredStations}
                    selectedStation={selectedStation}
                    onStationSelect={handleStationSelect}
                    emptyMessage={
                      currentLocation 
                        ? 'No charging stations found in this area. Try expanding your search radius or adjusting filters.'
                        : 'Enter a location to find charging stations.'
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
  } catch (error) {
    console.error('Error rendering ChargerFinder:', error);
    return (
      <div className="charger-finder__error" style={{ padding: '20px', border: '2px solid red' }}>
        <h3>Error rendering ChargerFinder</h3>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      </div>
    );
  }
}
