
import { Station } from '../types/nrel';
import { StationCard } from './StationCard';
import { clsx } from 'clsx';

export interface StationListProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
  className?: string;
  emptyMessage?: string;
}

export function StationList({
  stations,
  selectedStation,
  onStationSelect,
  className,
  emptyMessage = 'No charging stations found in this area.',
}: StationListProps) {
  if (stations.length === 0) {
    return (
      <div className={clsx('charger-finder__list', className)}>
        <div className="charger-finder__empty">
          <svg
            className="w-12 h-12 text-cevs-muted mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-cevs-muted text-center">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('charger-finder__list', className)}>
      <div className="space-y-2">
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            isSelected={selectedStation?.id === station.id}
            onClick={() => onStationSelect(station)}
          />
        ))}
      </div>
      
      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-cevs-border">
        <p className="text-sm text-cevs-muted text-center">
          Found {stations.length} charging station{stations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
