# @commercialevs/charger-insights

[![npm version](https://badge.fury.io/js/%40commercialevs%2Fcharger-insights.svg)](https://badge.fury.io/js/%40commercialevs%2Fcharger-insights)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A production-ready, MIT-licensed React component library for finding EV charging stations using the NREL Alternative Fuel Stations API. Built specifically for commercial EV platforms with TypeScript, accessibility, and performance in mind.

## ✨ Features

- 🔍 **Smart Search**: Address input with geocoding + browser geolocation
- 🗺️ **Interactive Maps**: Leaflet-based maps with custom markers
- 📋 **Flexible Views**: Map, list, or split view modes
- ⚡ **Real-time Data**: NREL API integration with React Query caching
- 🎨 **Theming**: Light/dark themes with CSS variable customization
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Mobile-first design with touch-friendly controls
- 🔧 **TypeScript**: Full type safety with strict mode
- 🧪 **Tested**: Comprehensive unit and integration tests
- 📚 **Documented**: Storybook stories and detailed API docs

## 🚀 Quick Start

### Installation

```bash
npm install @commercialevs/charger-insights react-leaflet leaflet @tanstack/react-query
```

### Basic Usage

```tsx
import { ChargerFinder } from '@commercialevs/charger-insights';
import '@commercialevs/charger-insights/styles.css';

function App() {
  return (
    <ChargerFinder
      apiKey={process.env.NEXT_PUBLIC_NREL_KEY}
      defaultFuelTypes={['ELEC']}
      view="split"
    />
  );
}
```

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js 18+
- NREL API key (free from [NREL Developer Network](https://developer.nrel.gov/signup/))

### Setup

```bash
# Clone the repository
git clone https://github.com/commercialevs/charger-insights.git
cd charger-insights

# Install dependencies
npm install

# Add your NREL API key to API.txt file
cp API.txt.example API.txt
# Edit API.txt and replace "your_nrel_api_key_here" with your actual NREL API key

# Start the development server
npm run dev
```

### Access the Demo

- **URL**: http://localhost:5173
- The demo will automatically load your API key from the `API.txt` file
- No manual API key input required

### Troubleshooting

If you encounter issues:

1. **CSS Errors**: The project uses custom Tailwind classes that are properly configured
2. **API Key Issues**: Ensure your NREL API key is valid and in the `API.txt` file
3. **Port Conflicts**: The demo runs on port 5173 by default
4. **Browser Compatibility**: Works best with modern browsers (Chrome, Firefox, Safari, Edge)

## 🔧 Configuration

### Environment Variables

Create a `.env` file with your NREL API key:

```env
NREL_API_KEY=your_nrel_api_key_here
NREL_BASE_URL=https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org/search
LOG_ENDPOINT=https://your-logging-service.com/logs
```

### Logging Configuration

The library includes a centralized logging system with environment-aware configuration:

```tsx
import { logger, LogLevel } from '@commercialevs/charger-insights';

// Configure logging
logger.setConfig({
  level: LogLevel.DEBUG, // ERROR, WARN, INFO, DEBUG
  enableConsole: true,
  enableRemote: true,
  remoteEndpoint: process.env.LOG_ENDPOINT
});

// Use in components
logger.info('Charger search initiated', { location: 'San Francisco' });
logger.error('API request failed', { error: 'Network timeout' });
```

**Log Levels:**
- **ERROR**: Critical errors that need immediate attention
- **WARN**: Warning conditions that should be monitored
- **INFO**: General information about application flow
- **DEBUG**: Detailed debugging information (development only)

### API Key Setup

1. Sign up for a free API key at [NREL Developer Network](https://developer.nrel.gov/signup/)
2. Add the key to your environment variables or pass it directly to the component
3. The API has generous rate limits for development and testing

## 📖 API Reference

### ChargerFinder Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | - | NREL API key (required) |
| `baseUrl` | `string` | NREL default | Custom API base URL |
| `initialLocation` | `{lat: number, lng: number}` | - | Initial map center |
| `defaultRadius` | `number` | `25` | Default search radius in miles |
| `defaultFuelTypes` | `string[]` | `['ELEC']` | Default fuel type filters |
| `defaultNetworks` | `string[]` | `[]` | Default network filters |
| `defaultConnectorTypes` | `string[]` | `[]` | Default connector type filters |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme mode |
| `view` | `'map' \| 'list' \| 'split'` | `'split'` | Default view mode |
| `onStationSelect` | `(station: Station) => void` | - | Station selection callback |
| `onSearch` | `(params: SearchParams) => void` | - | Search execution callback |
| `onError` | `(error: Error) => void` | - | Error handling callback |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |

### Available Fuel Types

- `ELEC` - Electric
- `CNG` - Compressed Natural Gas
- `LPG` - Propane (LPG)
- `LNG` - Liquefied Natural Gas
- `E85` - Ethanol (E85)
- `BD` - Biodiesel
- `HY` - Hydrogen
- `RD` - Renewable Diesel

### Available Connector Types

- `J1772` - J1772
- `CHADEMO` - CHAdeMO
- `CCS` - CCS
- `NACS` - NACS (Tesla)
- `TYPE1` - Type 1
- `TYPE2` - Type 2
- `TYPE3` - Type 3

## 🎨 Theming

### CSS Variables

The component uses CSS variables for theming. Override them in your CSS:

```css
:root {
  --cevs-bg: #ffffff;
  --cevs-fg: #0f172a;
  --cevs-accent: #2563eb;
  --cevs-border: #e2e8f0;
  --cevs-radius: 0.5rem;
  --cevs-spacing: 1rem;
}
```

### Theme Modes

- `light` - Light theme
- `dark` - Dark theme  
- `auto` - Follows system preference

## 🔌 Integrating with Next.js (commercialevs.com)

### Client Component Setup

Create a client component to avoid SSR issues with Leaflet:

```tsx
// app/(marketing)/components/ChargerFinderClient.tsx
'use client';

import { ChargerFinder } from '@commercialevs/charger-insights';
import '@commercialevs/charger-insights/styles.css';

export default function ChargerFinderClient() {
  return (
    <div className="rounded-2xl border p-4">
      <ChargerFinder
        apiKey={process.env.NEXT_PUBLIC_NREL_KEY}
        defaultFuelTypes={['ELEC']}
        view="split"
        onStationSelect={(station) => {
          console.log('Selected station:', station);
        }}
      />
    </div>
  );
}
```

### Dynamic Import (Recommended)

Use dynamic import to avoid SSR issues:

```tsx
// app/(marketing)/page.tsx
import dynamic from 'next/dynamic';

const ChargerFinderClient = dynamic(
  () => import('./ChargerFinderClient'),
  { 
    ssr: false,
    loading: () => <div>Loading charger finder...</div>
  }
);

export default function Page() {
  return (
    <div>
      <h1>Find Charging Stations</h1>
      <ChargerFinderClient />
    </div>
  );
}
```

### Environment Configuration

Add to your `.env.local`:

```env
NEXT_PUBLIC_NREL_KEY=your_nrel_api_key_here
```

## 🧪 Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/commercialevs/charger-insights.git
cd charger-insights

# Install dependencies
pnpm install

# Set up environment variables
cp env.example .env
# Edit .env with your NREL API key
```

### Available Scripts

```bash
# Development
pnpm dev              # Start demo app
pnpm storybook        # Start Storybook
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode

# Building
pnpm build            # Build library
pnpm type-check       # TypeScript check
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint fix

# Documentation
pnpm storybook:build  # Build Storybook
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/lib/fetcher.test.ts
```

## 📚 Storybook

View interactive examples and documentation:

```bash
pnpm storybook
```

Available stories:
- Default - Basic usage
- SplitView - Map and list side by side
- MapOnly - Map view only
- ListOnly - List view only
- DarkTheme - Dark theme example
- EmbeddedCard - Embedded in a card layout
- ErrorState - Error handling
- LoadingState - Loading states

## 🏗️ Architecture

### File Structure

```
src/
├── components/          # React components
│   ├── ChargerFinder.tsx
│   ├── SearchBar.tsx
│   ├── Filters.tsx
│   ├── ViewToggle.tsx
│   ├── StationList.tsx
│   ├── StationCard.tsx
│   └── map/
│       ├── MapView.tsx
│       └── StationMarker.tsx
├── hooks/              # Custom React hooks
│   ├── useChargerSearch.ts
│   └── useGeolocation.ts
├── lib/                # Utility libraries
│   ├── env.ts
│   ├── fetcher.ts
│   ├── nrel.ts
│   └── geocode.ts
├── types/              # TypeScript types
│   └── nrel.ts
├── styles.css          # Main styles
├── theme.css           # Theme variables
└── index.ts            # Public exports
```

### Key Technologies

- **React 18+** - Modern React with hooks
- **TypeScript 5** - Type safety and developer experience
- **React Query** - Server state management and caching
- **Leaflet** - Interactive maps
- **Tailwind CSS** - Utility-first styling
- **Zod** - Runtime type validation
- **Vitest** - Fast unit testing
- **Storybook** - Component documentation
- **Centralized Logging** - Environment-aware logging with remote support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update Storybook stories
- Follow the existing code style
- Add JSDoc comments for public APIs
- Use conventional commit messages
- Ensure all CI checks pass

### Automated Workflows

Our GitHub Actions provide comprehensive automation:

- **CI/CD Pipeline**: Automated testing, linting, and building
- **Security Scanning**: Dependency vulnerability checks
- **Performance Testing**: Lighthouse performance analysis
- **Accessibility Testing**: WCAG compliance verification
- **Bundle Analysis**: Size monitoring and optimization
- **Documentation Deployment**: Automatic Storybook deployment
- **Dependency Updates**: Automated security patches via Dependabot

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NREL](https://developer.nrel.gov/) for providing the Alternative Fuel Stations API
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles and geocoding
- [Leaflet](https://leafletjs.com/) for the mapping library
- [React Query](https://tanstack.com/query) for server state management

## 📞 Support

- 📧 Email: support@commercialevs.com
- 🐛 Issues: [GitHub Issues](https://github.com/commercialevs/charger-insights/issues)
- 📖 Docs: [Storybook](https://commercialevs.github.io/charger-insights)

## 🔄 Changelog

### [1.0.1] - 2024-01-XX

#### Fixed
- **API Response Validation**: Fixed Zod schema to handle NREL API response format
  - Added support for `null` values in optional fields
  - Fixed EVSE number fields to accept both strings and numbers
  - Added support for boolean values in `e85_blender_pump` field
  - Fixed `station_counts` field to handle object format
- **Environment Configuration**: Improved browser environment handling
  - Fixed `process.env` access in browser environment
  - Added proper fallbacks for environment variables
  - Enhanced API key configuration handling
- **CSS Compilation**: Fixed Tailwind CSS compilation issues
  - Resolved custom color opacity modifiers
  - Fixed CSS import order for Leaflet styles
- **Demo Application**: Enhanced local development experience
  - Automatic API key loading from `API.txt` file
  - Improved error handling and user feedback
  - Better development server configuration

#### Improved
- **Type Safety**: Enhanced TypeScript types for better developer experience
- **Error Handling**: More robust error handling for API responses
- **Documentation**: Updated README with local development instructions

### [1.0.0] - 2024-01-XX

#### Added
- Initial release
- ChargerFinder component with map and list views
- NREL API integration
- Geolocation support
- Theme system (light/dark/auto)
- Accessibility features
- TypeScript support
- Comprehensive testing
- Storybook documentation

#### Features
- Address search with geocoding
- Browser geolocation
- Interactive Leaflet maps
- Station filtering (fuel type, network, connector)
- Responsive design
- Error handling and retry logic
- React Query caching
- LocalStorage persistence

---

Built with ❤️ for the commercial EV industry
#   U p d a t e d   2 0 2 5 - 0 8 - 2 7   1 5 : 4 2 : 0 3 
 
 