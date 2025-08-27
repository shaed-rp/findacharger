import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChargerFinder } from '../../src/components/ChargerFinder';
import '../../src/styles.css';
import '../../src/theme.css';
import './index.css';

// Create a query client for the demo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 300000,
      retry: 2,
    },
  },
});

function DemoApp() {
  const [apiKey, setApiKey] = React.useState('');
  const [hasApiKey, setHasApiKey] = React.useState(false);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setHasApiKey(true);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Charger Insights Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This demo requires an NREL API key to function. Please enter your API key below.
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                NREL API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your NREL API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Demo
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-500">
            <p>Don't have an API key? Get one at:</p>
            <a
              href="https://developer.nrel.gov/signup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://developer.nrel.gov/signup/
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
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
                console.log('Selected station:', station);
              }}
              onSearch={(params) => {
                console.log('Search params:', params);
              }}
              onError={(error) => {
                console.error('Charger finder error:', error);
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
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
