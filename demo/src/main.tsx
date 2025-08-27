import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChargerFinder } from '@commercialevs/charger-insights';
import '@commercialevs/charger-insights/styles.css';
import '@commercialevs/charger-insights/theme.css';
import './index.css';

function DemoApp() {
  // Use the API key from the API.txt file
  const apiKey = 'm5yTajemu8TgV6U0j8QsDaDSr58DL2h7KXZXEMo2';

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
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
