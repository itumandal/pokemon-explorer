import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonDetail from './PokemonDetail';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IEvolutionNode, usePokemonDetailQuery } from '../../customHooks/usePokemonQueries';
import { usePokemonStats } from '../../customHooks/usePokemonStats';
import { IMoveItem } from '../../components/MovesList/MovesList';

// Mock all hooks and functions
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../customHooks/usePokemonQueries', () => ({
  usePokemonDetailQuery: jest.fn(),
  usePokemonStats: jest.fn(),
}));

jest.mock('../../api/pokemonApi', () => ({
  getPokemonDetail: jest.fn(),
}));

jest.mock('../../utils/config', () => ({
  createStatsMap: jest.fn(() => new Map()),
  getStatValue: jest.fn(() => 50),
  STAT_CONFIG: [{ label: 'HP', keys: ['hp'] }],
}));

jest.mock('../../utils/pokemonColors', () => ({
  getTypeStyle: jest.fn((type: string) => ({ color: 'red', icon: '⚡' })),
}));

jest.mock('../../components/HorizontalBaseStats/HorizontalBaseStats', () => ({
  __esModule: true,
  default: ({ label, value }: { label: string; value: number }) => (
    <div>
      {label}: {value}
    </div>
  ),
}));

jest.mock('../../components/MovesList/MovesList', () => ({
  __esModule: true,
  default: ({ moves }: { moves?: IMoveItem[] }) => <div>Moves Component</div>,
}));

jest.mock('../../components/EvolutionChain/EvolutionChain', () => ({
  __esModule: true,
  default: ({ chain }: { chain: IEvolutionNode }) => <div>Evolution Chain Component</div>,
}));

jest.mock('../../customHooks/usePokemonQueries', () => ({
  usePokemonDetailQuery: jest.fn(),
}));

jest.mock('../../customHooks/usePokemonStats', () => ({
  usePokemonStats: jest.fn(),
}));

jest.mock('../../components/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('PokemonDetail', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: '25', name: 'pikachu' });
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        id: 25,
        name: 'pikachu',
        base_experience: 112,
        height: 4,
        weight: 60,
        types: [],
        abilities: [],
        stats: [],
        sprites: { front_default: 'pikachu.png' },
      },
      isLoading: false,
      isError: false,
    });
    (usePokemonDetailQuery as jest.Mock).mockReturnValue({
      speciesQuery: { isLoading: false, isError: false },
      evolutionQuery: { data: { chain: {} }, isLoading: false },
    });
    (usePokemonStats as jest.Mock).mockReturnValue({ typeList: ['electric'] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (usePokemonDetailQuery as jest.Mock).mockReturnValueOnce({
      speciesQuery: { isLoading: true, isError: false },
      evolutionQuery: { isLoading: true, data: null },
    });
    render(<PokemonDetail />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (usePokemonDetailQuery as jest.Mock).mockReturnValueOnce({
      speciesQuery: { isLoading: false, isError: true },
      evolutionQuery: { data: null, isLoading: false },
    });
    render(<PokemonDetail />);
    expect(screen.getByText('Unable to load Pokémon details.')).toBeInTheDocument();
  });

  test('renders Pokemon details correctly', () => {
    render(<PokemonDetail />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Moves Component')).toBeInTheDocument();
    expect(screen.getByText('Evolution Chain Component')).toBeInTheDocument();
    expect(screen.getByText('HP: 50')).toBeInTheDocument();
    expect(screen.getByText(/Back/)).toBeInTheDocument();
  });

  test('navigates back on button click', async () => {
    render(<PokemonDetail />);
    const backButton = screen.getByText(/Back/);
    await userEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
