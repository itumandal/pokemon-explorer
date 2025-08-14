import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

/** Mock the page components */
jest.mock('./pages/pokemonCollection/PokemonCollection', () => ({
  __esModule: true,
  default: () => <div data-testid="pokemon-collection">Pokemon Collection Page</div>,
}));

jest.mock('./pages/pokemonDetail/PokemonDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="pokemon-detail">Pokemon Detail Page</div>,
}));
jest.mock('./pages/NotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="page-not-found">404 - Page Not Found</div>,
}));

describe('App routing', () => {
  const setup = (route: string) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
  };
  afterEach(() => cleanup());
  test('renders Pokemon Collection on default route', () => {
    setup('/');
    expect(screen.getByTestId('pokemon-collection')).toBeInTheDocument();
  });

  test('renders PokemonDetail on /pokemon/:id/:name route', () => {
    setup('/pokemon/1/pikachu');
    expect(screen.getByTestId('pokemon-detail')).toBeInTheDocument();
  });

  test('renders NotFound for an unknown route', () => {
    setup('/unknown-route');
    expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
  });
});
