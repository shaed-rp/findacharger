/**
 * Robust fetch utility with retry logic, backoff, and error handling
 */

export interface FetchOptions extends RequestInit {
  retries?: number;
  backoffMs?: number;
  timeout?: number;
}

export interface FetchError extends Error {
  status?: number;
  code?: string;
  url?: string;
}

/**
 * Default fetch options
 */
const DEFAULT_OPTIONS: Required<Pick<FetchOptions, 'retries' | 'backoffMs' | 'timeout'>> = {
  retries: 2,
  backoffMs: 1000,
  timeout: 10000,
};

/**
 * Create an AbortController for timeout
 */
function createTimeoutController(timeout: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(attempt: number, baseDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: FetchError): boolean {
  // Don't retry 4xx errors (client errors)
  if (error.status && error.status >= 400 && error.status < 500) {
    return false;
  }
  
  // Retry network errors, timeouts, and 5xx errors
  return true;
}

/**
 * Fetch with retry logic and exponential backoff
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: FetchOptions
): Promise<Response> {
  const options = { ...DEFAULT_OPTIONS, ...init };
  const { retries, backoffMs, timeout, ...fetchInit } = options;
  
  let lastError: FetchError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create timeout controller
      const timeoutController = createTimeoutController(timeout);
      
      // Merge abort signals
      const abortController = new AbortController();
      if (fetchInit.signal) {
        fetchInit.signal.addEventListener('abort', () => abortController.abort());
      }
      timeoutController.signal.addEventListener('abort', () => abortController.abort());
      
      // Make the request
      const response = await fetch(input, {
        ...fetchInit,
        signal: abortController.signal,
      });
      
      // Check if response is ok
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as FetchError;
        error.status = response.status;
        error.url = typeof input === 'string' ? input : input.toString();
        throw error;
      }
      
      return response;
    } catch (error) {
      lastError = error as FetchError;
      
      // Don't retry if it's the last attempt or if error is not retryable
      if (attempt === retries || !isRetryableError(lastError)) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = calculateBackoff(attempt, backoffMs);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Fetch JSON with automatic parsing and error handling
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: FetchOptions
): Promise<T> {
  const response = await fetchWithRetry(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  
  try {
    return await response.json();
  } catch (error) {
    const fetchError = new Error('Failed to parse JSON response') as FetchError;
    fetchError.cause = error;
    fetchError.url = typeof input === 'string' ? input : input.toString();
    throw fetchError;
  }
}

/**
 * Create a URL with query parameters
 */
export function createUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });
  
  return url.toString();
}
