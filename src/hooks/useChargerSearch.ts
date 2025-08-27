import { useQuery } from '@tanstack/react-query';
import { NRELService } from '../lib/nrel';
import { SearchParams, Station } from '../types/nrel';

/**
 * Hook for searching charging stations using React Query
 */
export function useChargerSearch(
  params: SearchParams | null,
  options?: {
    apiKey?: string;
    baseUrl?: string;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) {
  const {
    apiKey,
    baseUrl,
    enabled = true,
    staleTime = 60000, // 1 minute
    cacheTime = 300000, // 5 minutes
  } = options || {};

  return useQuery({
    queryKey: ['charger-search', params],
    queryFn: async (): Promise<Station[]> => {
      if (!params) {
        throw new Error('Search parameters are required');
      }

      const service = new NRELService({ 
        nrelApiKey: apiKey, 
        nrelBaseUrl: baseUrl 
      });
      
      // Validate parameters
      const errors = service.validateSearchParams(params);
      if (errors.length > 0) {
        throw new Error(`Invalid search parameters: ${errors.join(', ')}`);
      }

      return service.fetchStations(params);
    },
    enabled: enabled && !!params,
    staleTime,
    gcTime: cacheTime, // React Query v5 uses gcTime instead of cacheTime
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for getting available fuel types
 */
export function useFuelTypes(options?: { apiKey?: string; baseUrl?: string }) {
  return useQuery({
    queryKey: ['fuel-types'],
    queryFn: () => {
      const service = new NRELService({ 
        nrelApiKey: options?.apiKey, 
        nrelBaseUrl: options?.baseUrl 
      });
      return service.getFuelTypes();
    },
    staleTime: Infinity, // Fuel types don't change often
    gcTime: Infinity,
  });
}

/**
 * Hook for getting available connector types
 */
export function useConnectorTypes(options?: { apiKey?: string; baseUrl?: string }) {
  return useQuery({
    queryKey: ['connector-types'],
    queryFn: () => {
      const service = new NRELService({ 
        nrelApiKey: options?.apiKey, 
        nrelBaseUrl: options?.baseUrl 
      });
      return service.getConnectorTypes();
    },
    staleTime: Infinity, // Connector types don't change often
    gcTime: Infinity,
  });
}

/**
 * Hook for searching with pagination
 */
export function useChargerSearchPaginated(
  params: SearchParams | null,
  page: number = 1,
  pageSize: number = 50,
  options?: {
    apiKey?: string;
    baseUrl?: string;
    enabled?: boolean;
  }
) {
  const paginatedParams = params ? {
    ...params,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  } : null;

  return useChargerSearch(paginatedParams, options);
}

/**
 * Hook for searching with infinite scroll
 */
export function useInfiniteChargerSearch(
  params: SearchParams | null,
  pageSize: number = 50,
  options?: {
    apiKey?: string;
    baseUrl?: string;
    enabled?: boolean;
  }
) {
  const { useInfiniteQuery } = require('@tanstack/react-query');
  
  return useInfiniteQuery({
    queryKey: ['charger-search-infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      if (!params) {
        throw new Error('Search parameters are required');
      }

      const service = new NRELService({ 
        nrelApiKey: options?.apiKey, 
        nrelBaseUrl: options?.baseUrl 
      });
      
      const searchParams = {
        ...params,
        limit: pageSize,
        offset: (pageParam - 1) * pageSize,
      };

      return service.fetchStations(searchParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: Station[], allPages: Station[][]) => {
      // If we got fewer results than requested, we've reached the end
      if (lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: options?.enabled !== false && !!params,
    staleTime: 60000,
    gcTime: 300000,
    retry: 2,
  });
}
