import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ChargerFinder, logger } from '@commercialevs/charger-insights';
import '@commercialevs/charger-insights/styles.css';
import '@commercialevs/charger-insights/theme.css';
import './index.css';
import { loadApiKey, getFallbackApiKey } from './utils/apiKeyLoader';

function DemoApp() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize logging for demo
  const demoLogger = logger.withContext('DemoApp');

  useEffect(() => {
    async function initializeApp() {
      try {
        demoLogger.info('Initializing demo application');
        
        // Try to load API key from file
        let key: string;
        try {
          key = await loadApiKey();
          demoLogger.info('API key loaded successfully from file');
        } catch (loadError) {
          demoLogger.warn('Failed to load API key from file, using fallback', { error: loadError });
          key = getFallbackApiKey();
        }
        
        setApiKey(key);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        demoLogger.error('Failed to initialize demo application', { error: errorMessage });
        setError(errorMessage);
        setLoading(false);
      }
    }

    initializeApp();
  }, [demoLogger]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Charger Insights Demo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Demo</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600">
              Please ensure API.txt exists in the root directory and contains a valid NREL API key.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No API key available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Charger Insights Demo
          </h1>
          <p className="text-gray-600">
            A demonstration of the @commercialevs/charger-insights package
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChargerFinder
            apiKey={apiKey}
            defaultFuelTypes={['ELEC']}
            defaultRadius={25}
            view="split"
            theme="light"
            onStationSelect={(station) => {
              demoLogger.info('Station selected', { 
                stationId: station.id, 
                stationName: station.station_name,
                location: `${station.latitude}, ${station.longitude}` 
              });
            }}
            onSearch={(params) => {
              demoLogger.info('Search executed', { 
                location: params.location,
                radius: params.radius,
                fuelTypes: params.fuelTypes 
              });
            }}
            onError={(error) => {
              demoLogger.error('Charger finder error', { 
                error: error.message,
                stack: error.stack 
              });
            }}
          />
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Built with ❤️ for the commercial EV industry
          </p>
          <p className="mt-2">
            Data provided by{' '}
            <a
              href="https://developer.nrel.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NREL Alternative Fuel Stations API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
