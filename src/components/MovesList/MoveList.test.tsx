import { render, screen } from '@testing-library/react';
import MovesList, { IMoveItem } from './MovesList';
import { usePokemonMoveQuery } from '../../customHooks/usePokemonQueries';

// Mock custom hooks and components
jest.mock('../../customHooks/usePokemonQueries');
jest.mock('../Loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('../ErrorMessage', () => () => <div data-testid="error">Error occurred</div>);

// Mock getTypeStyle
jest.mock('../../utils/pokemonColors', () => ({
  getTypeStyle: (type: string) => ({ icon: '⚡', color: 'yellow' }),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

const mockUsePokemonMoveQuery = usePokemonMoveQuery as jest.Mock;

describe('MovesList', () => {
  const sampleMoves: IMoveItem[] = [
    { move: { name: 'thunder-shock', url: '/move/1/' }, type: { name: 'electric' } },
    { move: { name: 'quick-attack', url: '/move/2/' }, type: { name: 'normal' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loader when initial loading', () => {
    mockUsePokemonMoveQuery.mockReturnValue({
      moveQueries: [{ isLoading: true, isError: false, data: undefined }],
      fetchedMoves: [],
    });

    render(<MovesList moves={sampleMoves} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('renders error when moveQueries has error', () => {
    mockUsePokemonMoveQuery.mockReturnValue({
      moveQueries: [{ isLoading: false, isError: true, data: undefined }],
      fetchedMoves: [],
    });

    render(<MovesList moves={sampleMoves} />);
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  test('renders list of moves correctly', () => {
    mockUsePokemonMoveQuery.mockReturnValue({
      moveQueries: [{ isLoading: false, isError: false, data: undefined }],
      fetchedMoves: sampleMoves,
    });

    render(<MovesList moves={sampleMoves} />);

    // check move names and types
    sampleMoves.forEach((m) => {
      expect(screen.getByText(m.move.name.replace('-', ' '))).toBeInTheDocument();
      expect(screen.getByText(`⚡${m.type.name}`)).toBeInTheDocument();
    });
  });

  test('renders nothing if moves is undefined', () => {
    mockUsePokemonMoveQuery.mockReturnValue({
      moveQueries: [],
      fetchedMoves: [],
    });

    const { container } = render(<MovesList moves={undefined} />);
    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});
