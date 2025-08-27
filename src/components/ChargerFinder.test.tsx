import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChargerFinder } from './ChargerFinder';
import { vi } from 'vitest';

// Mock the hooks
vi.mock('../hooks/useChargerSearch', () => ({
  useChargerSearch: vi.fn(),
}));

vi.mock('../hooks/useGeolocation', () => ({
  useGeolocation: vi.fn(() => ({
    location: null,
    loading: false,
    error: null,
    supported: true,
    requestLocation: vi.fn(),
    clearError: vi.fn(),
  })),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock navigator.geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  writable: true,
});

const mockUseChargerSearch = vi.mocked(require('../hooks/useChargerSearch').useChargerSearch);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ChargerFinder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChargerSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(screen.getByText('Find EV Charging Stations')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseChargerSearch.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(screen.getByText('Finding charging stations...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const mockError = new Error('API Error');
    mockUseChargerSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });

    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(screen.getByText('Error loading stations')).toBeInTheDocument();
    expect(screen.getByText('API Error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('shows empty state when no stations found', () => {
    mockUseChargerSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(screen.getByText('Enter a location to find charging stations.')).toBeInTheDocument();
  });

  it('renders view toggle buttons', () => {
    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(screen.getByLabelText('Switch to Map view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to List view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Split view')).toBeInTheDocument();
  });

  it('changes view when toggle buttons are clicked', () => {
    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    const mapButton = screen.getByLabelText('Switch to Map view');
    fireEvent.click(mapButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('@cevs/ci:view', 'map');
  });

  it('loads persisted view preference', () => {
    localStorageMock.getItem.mockReturnValue('list');

    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
      />
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('@cevs/ci:view');
  });

  it('calls onError callback when error occurs', () => {
    const mockError = new Error('API Error');
    const onError = vi.fn();
    
    mockUseChargerSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });

    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
        onError={onError}
      />
    );

    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('renders with custom theme class', () => {
    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
        theme="dark"
      />
    );

    const container = screen.getByRole('region');
    expect(container).toHaveClass('cevs-theme-dark');
  });

  it('renders with custom className', () => {
    renderWithQueryClient(
      <ChargerFinder
        apiKey="test-key"
        defaultFuelTypes={['ELEC']}
        className="custom-class"
      />
    );

    const container = screen.getByRole('region');
    expect(container).toHaveClass('custom-class');
  });
});
