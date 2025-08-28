/**
 * Utility to load API key from API.txt file
 * This provides a secure way to load the API key without hardcoding it
 */

export async function loadApiKey(): Promise<string> {
  try {
    // In a real application, this would be loaded from environment variables
    // For the demo, we'll load from the API.txt file
    const response = await fetch('/API.txt');
    if (!response.ok) {
      throw new Error('Failed to load API key file');
    }
    
    const apiKey = await response.text();
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey || trimmedKey === 'your_nrel_api_key_here') {
      throw new Error('Invalid API key - please update API.txt with your NREL API key');
    }
    
    return trimmedKey;
  } catch (error) {
    console.error('Error loading API key:', error);
    throw new Error('Failed to load API key. Please ensure API.txt exists and contains a valid NREL API key.');
  }
}

/**
 * Fallback API key loader for development
 * This should only be used in development environments
 */
export function getFallbackApiKey(): string {
  // This is a fallback for development only
  // In production, this should never be used
  const fallbackKey = 'm5yTajemu8TgV6U0j8QsDaDSr58DL2h7KXZXEMo2';
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Fallback API key should not be used in production');
  }
  
  return fallbackKey;
}
