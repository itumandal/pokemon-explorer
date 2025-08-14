import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCollection from './PokemonCollection';
import { usePokemonList } from '../../customHooks/usePokemonQueries';
import { getTypeStyle } from '../../utils/pokemonColors';
import { IPokemonDashboardStatsProps } from '../../components/PokemonDashboardStatsCard/PokemonDashboardStatsCard';
import { IPokemonTableProps } from '../../components/PokemonTable/PokemonTable';

jest.mock('../../customHooks/usePokemonQueries');
jest.mock('../../components/Loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('../../components/ErrorMessage', () => () => <div data-testid="error">Error!</div>);
jest.mock(
  '../../components/PokemonDashboardStatsCard/PokemonDashboardStatsCard',
  () => (props: IPokemonDashboardStatsProps) => (
    <div data-testid="dashboard-card">{props.topText}</div>
  )
);
jest.mock('../../components/PokemonTable/PokemonTable', () => (props: IPokemonTableProps) => (
  <div data-testid="pokemon-table">{props.data.length} rows</div>
));
jest.mock('../../utils/pokemonColors', () => ({
  getTypeStyle: jest.fn(),
}));

const mockUsePokemonList = usePokemonList as jest.Mock;
const mockGetTypeStyle = getTypeStyle as jest.Mock;

describe('PokemonCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTypeStyle.mockReturnValue({ color: 'red', icon: '🔥' });
  });

  test('renders loader when loading', () => {
    mockUsePokemonList.mockReturnValue({
      pokemonListQuery: { data: null, isLoading: true, isError: false },
      detailQueries: [],
    });
    render(<PokemonCollection />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renders error when error occurs', () => {
    mockUsePokemonList.mockReturnValue({
      pokemonListQuery: { data: null, isLoading: false, isError: true },
      detailQueries: [],
    });
    render(<PokemonCollection />);
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  test('renders dashboard cards and table on success', () => {
    const mockDetails = [
      {
        id: 1,
        name: 'pikachu',
        base_experience: 100,
        sprites: { front_default: 'image-url' },
        stats: [
          { stat: { name: 'hp' }, base_stat: 50 },
          { stat: { name: 'speed' }, base_stat: 90 },
        ],
        types: [{ type: { name: 'electric' } }],
        abilities: [{ ability: { name: 'static' } }],
      },
    ];
    mockUsePokemonList.mockReturnValue({
      pokemonListQuery: { data: { count: 1 }, isLoading: false, isError: false },
      detailQueries: mockDetails.map((p) => ({ isSuccess: true, data: p, isLoading: false })),
    });

    render(<PokemonCollection />);
    expect(screen.getAllByTestId('dashboard-card').length).toBeGreaterThan(0);
    expect(screen.getByTestId('pokemon-table')).toHaveTextContent('1 rows');
  });

  test('disables Prev button on first page and Next button on last page', () => {
    mockUsePokemonList.mockReturnValue({
      pokemonListQuery: { data: { count: 5 }, isLoading: false, isError: false },
      detailQueries: [
        {
          isSuccess: true,
          isLoading: false,
          data: {
            id: 1,
            name: 'pikachu',
            base_experience: 100,
            sprites: { front_default: 'image' },
            stats: [
              { stat: { name: 'hp' }, base_stat: 50 },
              { stat: { name: 'speed' }, base_stat: 90 },
            ],
            types: [{ type: { name: 'electric' } }],
            abilities: [{ ability: { name: 'static' } }],
          },
        },
      ],
    });

    render(<PokemonCollection />);
    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  test('changes page when clicking Next', () => {
    mockUsePokemonList
      .mockReturnValueOnce({
        pokemonListQuery: { data: { count: 20 }, isLoading: false, isError: false },
        detailQueries: [
          {
            isSuccess: true,
            isLoading: false,
            data: {
              id: 1,
              name: 'pikachu',
              base_experience: 100,
              sprites: { front_default: 'image' },
              stats: [
                { stat: { name: 'hp' }, base_stat: 50 },
                { stat: { name: 'speed' }, base_stat: 90 },
              ],
              types: [{ type: { name: 'electric' } }],
              abilities: [{ ability: { name: 'static' } }],
            },
          },
        ],
      })
      .mockReturnValueOnce({
        pokemonListQuery: { data: { count: 20 }, isLoading: false, isError: false },
        detailQueries: [
          {
            isSuccess: true,
            isLoading: false,
            data: {
              id: 2,
              name: 'bulbasaur',
              base_experience: 100,
              sprites: { front_default: 'image' },
              stats: [
                { stat: { name: 'hp' }, base_stat: 60 },
                { stat: { name: 'speed' }, base_stat: 80 },
              ],
              types: [{ type: { name: 'grass' } }],
              abilities: [{ ability: { name: 'overgrow' } }],
            },
          },
        ],
      });

    render(<PokemonCollection />);
    fireEvent.click(screen.getByText('Next'));
    // Second render should have bulbasaur
    expect(mockUsePokemonList).toHaveBeenCalledTimes(2);
  });
});
