import { z } from 'zod';
import React from 'react';

// NREL API Response Schemas
export const NRELStationSchema = z.object({
  id: z.number(),
  station_name: z.string(),
  fuel_type_code: z.string(),
  status_code: z.string().optional(),
  ev_network: z.string().optional(),
  ev_connector_types: z.array(z.string()).optional(),
  latitude: z.number(),
  longitude: z.number(),
  street_address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  access_days_time: z.string().optional(),
  access_code: z.string().optional(),
  access_detail_code: z.string().optional(),
  cards_accepted: z.string().optional(),
  bd_blends: z.string().optional(),
  cng_fill_type_code: z.string().optional(),
  cng_psi: z.string().optional(),
  cng_vehicle_class: z.string().optional(),
  e85_blender_pump: z.string().optional(),
  ev_level1_evse_num: z.string().optional(),
  ev_level2_evse_num: z.string().optional(),
  ev_dc_fast_num: z.string().optional(),
  ev_other_evse: z.string().optional(),
  ev_network_web: z.string().optional(),
  ev_pricing: z.string().optional(),
  lpg_primary: z.string().optional(),
  ng_fill_type_code: z.string().optional(),
  ng_psi: z.string().optional(),
  ng_vehicle_class: z.string().optional(),
  access_days_time_fr: z.string().optional(),
  intersection_directions: z.string().optional(),
  plus4: z.string().optional(),
  station_phone: z.string().optional(),
  facility_type: z.string().optional(),
  geocode_status: z.string().optional(),
  date_last_confirmed: z.string().optional(),
  updated_at: z.string().optional(),
  owner_type_code: z.string().optional(),
  federal_agency_id: z.number().optional(),
  federal_agency_name: z.string().optional(),
  open_date: z.string().optional(),
  federal_agency_code: z.string().optional(),
  facility_id: z.number().optional(),
});

export const NRELResponseSchema = z.object({
  fuel_stations: z.array(NRELStationSchema),
  total_results: z.number(),
  station_counts: z.record(z.number()).optional(),
});

// Internal Station Type (cleaned up from NREL response)
export interface Station {
  id: number;
  name: string;
  fuelType: string;
  status: 'available' | 'unavailable' | 'unknown';
  network?: string;
  connectorTypes: string[];
  location: {
    lat: number;
    lng: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  access: {
    daysTime?: string;
    code?: string;
    detailCode?: string;
  };
  pricing?: string;
  phone?: string;
  website?: string;
  distance?: number; // Calculated distance from search location
  evseCounts: {
    level1?: number;
    level2?: number;
    dcFast?: number;
    other?: number;
  };
}

// Search Parameters
export interface SearchParams {
  location: {
    lat: number;
    lng: number;
  };
  radius: number;
  fuelTypes: string[];
  limit?: number;
  offset?: number;
}

// Filter Options
export interface FilterOptions {
  radius: number;
  fuelTypes: string[];
  networks: string[];
  connectorTypes: string[];
  openNow: boolean;
  unit: 'miles' | 'kilometers';
}

// Fuel Type Definitions
export const FUEL_TYPES = {
  ELEC: 'Electric',
  CNG: 'Compressed Natural Gas',
  LPG: 'Propane (LPG)',
  LNG: 'Liquefied Natural Gas',
  E85: 'Ethanol (E85)',
  BD: 'Biodiesel',
  HY: 'Hydrogen',
  RD: 'Renewable Diesel',
} as const;

export type FuelType = keyof typeof FUEL_TYPES;

// Connector Type Definitions
export const CONNECTOR_TYPES = {
  J1772: 'J1772',
  CHADEMO: 'CHAdeMO',
  CCS: 'CCS',
  NACS: 'NACS (Tesla)',
  TYPE1: 'Type 1',
  TYPE2: 'Type 2',
  TYPE3: 'Type 3',
} as const;

export type ConnectorType = keyof typeof CONNECTOR_TYPES;

// View Modes
export type ViewMode = 'map' | 'list' | 'split';

// Theme Options
export type Theme = 'light' | 'dark' | 'auto';

// Component Props
export interface ChargerFinderProps {
  apiKey?: string;
  baseUrl?: string;
  initialLocation?: { lat: number; lng: number };
  defaultRadius?: number;
  defaultFuelTypes?: string[];
  defaultNetworks?: string[];
  defaultConnectorTypes?: string[];
  theme?: Theme;
  view?: ViewMode;
  onStationSelect?: (station: Station) => void;
  onSearch?: (params: SearchParams) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Geolocation Types
export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// API Error Types
export interface APIError extends Error {
  status?: number;
  code?: string;
}

// Distance Calculation Result
export interface DistanceResult {
  distance: number;
  unit: 'miles' | 'kilometers';
  formatted: string;
}
