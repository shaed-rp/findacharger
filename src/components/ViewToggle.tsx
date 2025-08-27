import React from 'react';
import { clsx } from 'clsx';
import { ViewMode } from '../types/nrel';

export interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
  disabled?: boolean;
}

export function ViewToggle({
  view,
  onViewChange,
  className,
  disabled = false,
}: ViewToggleProps) {
  const viewOptions: Array<{ value: ViewMode; label: string; icon: React.ReactNode }> = [
    {
      value: 'map',
      label: 'Map',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
      ),
    },
    {
      value: 'list',
      label: 'List',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'split',
      label: 'Split',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={clsx('charger-finder__view-toggle', className)}>
      {viewOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onViewChange(option.value)}
          disabled={disabled}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors',
            view === option.value
              ? 'bg-cevs-accent text-white'
              : 'bg-cevs-bg text-cevs-muted hover:bg-cevs-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label={`Switch to ${option.label} view`}
          aria-pressed={view === option.value}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
