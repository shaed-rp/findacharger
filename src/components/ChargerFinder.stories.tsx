import type { Meta, StoryObj } from '@storybook/react';
import { ChargerFinder } from './ChargerFinder';

const meta: Meta<typeof ChargerFinder> = {
  title: 'Components/ChargerFinder',
  component: ChargerFinder,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'auto'],
    },
    view: {
      control: { type: 'select' },
      options: ['map', 'list', 'split'],
    },
    defaultFuelTypes: {
      control: { type: 'object' },
    },
    defaultRadius: {
      control: { type: 'number', min: 1, max: 200 },
    },
  },
  args: {
    apiKey: 'demo-key',
    defaultFuelTypes: ['ELEC'],
    defaultRadius: 25,
    theme: 'light',
    view: 'split',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const SplitView: Story = {
  args: {
    view: 'split',
  },
};

export const MapOnly: Story = {
  args: {
    view: 'map',
  },
};

export const ListOnly: Story = {
  args: {
    view: 'list',
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const ElectricOnly: Story = {
  args: {
    defaultFuelTypes: ['ELEC'],
  },
};

export const MultipleFuelTypes: Story = {
  args: {
    defaultFuelTypes: ['ELEC', 'CNG', 'HY'],
  },
};

export const LargeRadius: Story = {
  args: {
    defaultRadius: 100,
  },
};

export const WithInitialLocation: Story = {
  args: {
    initialLocation: { lat: 40.7128, lng: -74.0060 }, // New York
  },
};

export const EmbeddedCard: Story = {
  args: {
    view: 'split',
    defaultRadius: 10,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '0.5rem', 
          padding: '1rem',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
            Find Charging Stations Near You
          </h3>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const ErrorState: Story = {
  args: {
    apiKey: 'invalid-key',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the error state when an invalid API key is provided.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    apiKey: 'loading-demo',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the loading state while fetching data.',
      },
    },
  },
};
