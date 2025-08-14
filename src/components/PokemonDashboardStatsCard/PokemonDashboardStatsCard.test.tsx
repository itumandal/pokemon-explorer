import { render, screen } from '@testing-library/react';
import PokemonDashboardStats, { IPokemonDashboardStatsProps } from './PokemonDashboardStatsCard';

describe('PokemonDashboardStats', () => {
  test('renders default layout with topText, value, and bottomText', () => {
    const props: IPokemonDashboardStatsProps = {
      topText: 'HP',
      value: 120,
      bottomText: 'Base Stat',
      layout: 'default',
    };

    render(<PokemonDashboardStats {...props} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Base Stat')).toBeInTheDocument();
  });

  test('renders distribution layout with distribution items', () => {
    const props: IPokemonDashboardStatsProps = {
      topText: 'Type Distribution',
      layout: 'distribution',
      distributionItems: [
        { icon: <span>🔥</span>, percentage: 60 },
        { icon: <span>💧</span>, percentage: 40 },
      ],
    };

    render(<PokemonDashboardStats {...props} />);

    expect(screen.getByText('Type Distribution')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('💧')).toBeInTheDocument();
  });

  test('renders nothing for missing optional props in default layout', () => {
    render(<PokemonDashboardStats />);

    expect(screen.queryByText(/./)).toBeNull();
  });

  test('renders nothing for empty distributionItems in distribution layout', () => {
    render(<PokemonDashboardStats layout="distribution" />);

    expect(screen.queryByText(/./)).toBeNull();
  });
});
