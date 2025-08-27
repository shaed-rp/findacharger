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

## 🔧 Configuration

### Environment Variables

Create a `.env` file with your NREL API key:

```env
NREL_API_KEY=your_nrel_api_key_here
NREL_BASE_URL=https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json
NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org/search
```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update Storybook stories
- Follow the existing code style
- Add JSDoc comments for public APIs

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
