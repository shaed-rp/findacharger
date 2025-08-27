/**
 * Environment configuration for the charger finder
 * Handles API keys and configuration with fallbacks
 */

export interface EnvConfig {
  nrelApiKey: string;
  nrelBaseUrl: string;
  nominatimBaseUrl: string;
}

/**
 * Get environment configuration with fallbacks
 * @param overrides - Optional overrides for API configuration
 * @returns Environment configuration
 * @throws Error if required configuration is missing
 */
export function getEnvConfig(overrides?: Partial<EnvConfig>): EnvConfig {
  // In browser environment, we can't access process.env directly
  // Use import.meta.env for Vite or window.__ENV__ for other bundlers
  const browserEnv = typeof window !== 'undefined' ? (window as any).__ENV__ : {};
  const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : {};
  
  // Safely access process.env only if it exists
  const processEnv = typeof process !== 'undefined' && process.env ? process.env : {};
  
  const config: EnvConfig = {
    nrelApiKey: overrides?.nrelApiKey ||
      (processEnv && processEnv.NREL_API_KEY) ||
      (browserEnv && browserEnv.NREL_API_KEY) ||
      (viteEnv && viteEnv.VITE_NREL_API_KEY) ||
      '',
    nrelBaseUrl: overrides?.nrelBaseUrl ||
      (processEnv && processEnv.NREL_BASE_URL) ||
      (browserEnv && browserEnv.NREL_BASE_URL) ||
      (viteEnv && viteEnv.VITE_NREL_BASE_URL) ||
      'https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json',
    nominatimBaseUrl: overrides?.nominatimBaseUrl ||
      (processEnv && processEnv.NOMINATIM_BASE_URL) ||
      (browserEnv && browserEnv.NOMINATIM_BASE_URL) ||
      (viteEnv && viteEnv.VITE_NOMINATIM_BASE_URL) ||
      'https://nominatim.openstreetmap.org/search',
  };

  // Validate required configuration
  if (!config.nrelApiKey) {
    throw new Error(
      'NREL API key is required. Please provide it via the apiKey prop or NREL_API_KEY environment variable.'
    );
  }

  return config;
}

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}

/**
 * Get the current environment (browser, node, or unknown)
 */
export function getEnvironment(): 'browser' | 'node' | 'unknown' {
  if (isBrowser()) return 'browser';
  if (isNode()) return 'node';
  return 'unknown';
}

/**
 * Validate API key format (basic validation)
 * @param apiKey - The API key to validate
 * @returns True if the API key appears valid
 */
export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.length > 0;
}

/**
 * Get a masked version of the API key for logging (shows first 4 and last 4 characters)
 * @param apiKey - The API key to mask
 * @returns Masked API key string
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return '***';
  }
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}
