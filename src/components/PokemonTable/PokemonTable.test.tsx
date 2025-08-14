import { render, screen, fireEvent } from '@testing-library/react';
import PokemonTable, { IPokemonTableProps } from './PokemonTable';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('PokemonTable', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const sampleData: IPokemonTableProps['data'] = [
    {
      id: 1,
      image: 'pikachu.png',
      name: 'pikachu',
      baseXp: 112,
      types: [{ icon: <span>⚡</span>, label: 'Electric' }],
      hp: 35,
      speed: 90,
      ability: 'Static',
    },
    {
      id: 2,
      image: 'bulbasaur.png',
      name: 'bulbasaur',
      baseXp: 64,
      types: [
        { icon: <span>🌱</span>, label: 'Grass' },
        { icon: <span>🧪</span>, label: 'Poison' },
      ],
      hp: 45,
      speed: 45,
      ability: 'Overgrow',
    },
  ];

  test('renders table headers correctly', () => {
    render(<PokemonTable data={sampleData} />);

    expect(screen.getByText('Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Primary Ability')).toBeInTheDocument();
  });

  test('renders all Pokémon rows with data', () => {
    render(<PokemonTable data={sampleData} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('Base XP: 112')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Base XP: 64')).toBeInTheDocument();
    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Poison')).toBeInTheDocument();
    expect(screen.getAllByText('45').length).toBe(2);
    expect(screen.getByText('Overgrow')).toBeInTheDocument();
  });

  test('navigates to correct Pokémon page on row click', () => {
    render(<PokemonTable data={sampleData} />);

    const firstRow = screen.getByText('pikachu').closest('tr');
    expect(firstRow).toBeInTheDocument();

    if (firstRow) fireEvent.click(firstRow);

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1/pikachu');
  });

  test('renders correctly with empty data', () => {
    render(<PokemonTable data={[]} />);
    expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
  });
});
