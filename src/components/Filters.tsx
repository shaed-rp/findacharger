
import { clsx } from 'clsx';
import { FilterOptions, FUEL_TYPES, CONNECTOR_TYPES } from '../types/nrel';

export interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
  disabled?: boolean;
  availableNetworks?: string[];
  availableConnectors?: string[];
}

export function Filters({
  filters,
  onFiltersChange,
  className,
  disabled = false,
  availableNetworks = [],
  availableConnectors = [],
}: FiltersProps) {
  const handleFilterChange = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleFuelTypeToggle = (fuelType: string) => {
    const newFuelTypes = filters.fuelTypes.includes(fuelType)
      ? filters.fuelTypes.filter(type => type !== fuelType)
      : [...filters.fuelTypes, fuelType];
    
    handleFilterChange('fuelTypes', newFuelTypes);
  };

  const handleNetworkToggle = (network: string) => {
    const newNetworks = filters.networks.includes(network)
      ? filters.networks.filter(n => n !== network)
      : [...filters.networks, network];
    
    handleFilterChange('networks', newNetworks);
  };

  const handleConnectorToggle = (connector: string) => {
    const newConnectors = filters.connectorTypes.includes(connector)
      ? filters.connectorTypes.filter(c => c !== connector)
      : [...filters.connectorTypes, connector];
    
    handleFilterChange('connectorTypes', newConnectors);
  };

  const radiusOptions = [
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
    { value: 200, label: '200 miles' },
  ];

  return (
    <div className={clsx('charger-finder__filters', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Radius Filter */}
        <div className="charger-finder__filter-group">
          <label className="charger-finder__filter-label">
            Search Radius
          </label>
          <select
            value={filters.radius}
            onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
            disabled={disabled}
            className="charger-finder__filter-select"
            aria-label="Select search radius"
          >
            {radiusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Toggle */}
        <div className="charger-finder__filter-group">
          <label className="charger-finder__filter-label">
            Unit
          </label>
          <div className="flex rounded-lg border border-cevs-border overflow-hidden">
            <button
              type="button"
              onClick={() => handleFilterChange('unit', 'miles')}
              disabled={disabled}
              className={clsx(
                'flex-1 px-3 py-2 text-sm font-medium transition-colors',
                filters.unit === 'miles'
                  ? 'bg-cevs-accent text-white'
                  : 'bg-cevs-bg text-cevs-muted hover:bg-cevs-bg-secondary'
              )}
              aria-label="Use miles"
            >
              Miles
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('unit', 'kilometers')}
              disabled={disabled}
              className={clsx(
                'flex-1 px-3 py-2 text-sm font-medium transition-colors',
                filters.unit === 'kilometers'
                  ? 'bg-cevs-accent text-white'
                  : 'bg-cevs-bg text-cevs-muted hover:bg-cevs-bg-secondary'
              )}
              aria-label="Use kilometers"
            >
              Kilometers
            </button>
          </div>
        </div>

        {/* Open Now Filter */}
        <div className="charger-finder__filter-group">
          <label className="charger-finder__filter-label">
            Availability
          </label>
          <div className="charger-finder__filter-checkbox">
            <input
              type="checkbox"
              id="open-now"
              checked={filters.openNow}
              onChange={(e) => handleFilterChange('openNow', e.target.checked)}
              disabled={disabled}
              className="charger-finder__filter-checkbox"
            />
            <label htmlFor="open-now" className="text-sm text-cevs-fg">
              Open now
            </label>
          </div>
        </div>
      </div>

      {/* Fuel Types */}
      <div className="charger-finder__filter-group">
        <label className="charger-finder__filter-label">
          Fuel Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(FUEL_TYPES).map(([code, name]) => (
            <div key={code} className="charger-finder__filter-checkbox">
              <input
                type="checkbox"
                id={`fuel-${code}`}
                checked={filters.fuelTypes.includes(code)}
                onChange={() => handleFuelTypeToggle(code)}
                disabled={disabled}
                className="charger-finder__filter-checkbox"
              />
              <label htmlFor={`fuel-${code}`} className="text-sm text-cevs-fg">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Networks (if available) */}
      {availableNetworks.length > 0 && (
        <div className="charger-finder__filter-group">
          <label className="charger-finder__filter-label">
            Networks
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableNetworks.map(network => (
              <div key={network} className="charger-finder__filter-checkbox">
                <input
                  type="checkbox"
                  id={`network-${network}`}
                  checked={filters.networks.includes(network)}
                  onChange={() => handleNetworkToggle(network)}
                  disabled={disabled}
                  className="charger-finder__filter-checkbox"
                />
                <label htmlFor={`network-${network}`} className="text-sm text-cevs-fg">
                  {network}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connector Types */}
      <div className="charger-finder__filter-group">
        <label className="charger-finder__filter-label">
          Connector Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(CONNECTOR_TYPES).map(([code, name]) => (
            <div key={code} className="charger-finder__filter-checkbox">
              <input
                type="checkbox"
                id={`connector-${code}`}
                checked={filters.connectorTypes.includes(code)}
                onChange={() => handleConnectorToggle(code)}
                disabled={disabled}
                className="charger-finder__filter-checkbox"
              />
              <label htmlFor={`connector-${code}`} className="text-sm text-cevs-fg">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Available Connectors (if different from standard list) */}
      {availableConnectors.length > 0 && availableConnectors.some(c => !Object.keys(CONNECTOR_TYPES).includes(c)) && (
        <div className="charger-finder__filter-group">
          <label className="charger-finder__filter-label">
            Available Connectors
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableConnectors
              .filter(c => !Object.keys(CONNECTOR_TYPES).includes(c))
              .map(connector => (
                <div key={connector} className="charger-finder__filter-checkbox">
                  <input
                    type="checkbox"
                    id={`connector-${connector}`}
                    checked={filters.connectorTypes.includes(connector)}
                    onChange={() => handleConnectorToggle(connector)}
                    disabled={disabled}
                    className="charger-finder__filter-checkbox"
                  />
                  <label htmlFor={`connector-${connector}`} className="text-sm text-cevs-fg">
                    {connector}
                  </label>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
