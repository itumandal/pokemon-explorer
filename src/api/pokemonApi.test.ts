import {
  getPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  getEvolutionChain,
  getMoveDetails,
} from './pokemonApi';
import type { IPokemonSpecies } from '../customHooks/usePokemonQueries';
import type { IPokemonListResponse, IPokemonDetail } from '../types/pokemon';
import type { IMoveItem } from '../components/MovesList/MovesList';

describe('pokemonApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Helper to mock fetch with proper types
  const mockFetch = <T>(data: T, ok = true, statusText = 'OK') => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok,
      json: async () => data,
      statusText,
    } as Response);
  };

  test('getPokemonList fetches and returns data', async () => {
    const mockData: IPokemonListResponse = { results: [], count: 0, next: null, previous: null };
    mockFetch(mockData);

    const data = await getPokemonList(10, 0);
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
    );
  });

  test('getPokemonList throws error when response not ok', async () => {
    mockFetch({}, false, 'Internal Server Error');

    await expect(getPokemonList(10, 0)).rejects.toThrow(
      'Failed to fetch Pokemon list: Internal Server Error'
    );
  });

  test('getPokemonDetail fetches and returns data', async () => {
    const mockData: IPokemonDetail = {
      id: 25,
      name: 'pikachu',
      base_experience: 112,
      height: 4,
      weight: 60,
      types: [],
      abilities: [],
      stats: [],
      sprites: {
        front_default: 'pikachu.png',
      },
    };
    mockFetch(mockData);

    const data = await getPokemonDetail('pikachu');
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
  });

  test('getPokemonSpecies fetches and returns data', async () => {
    const mockData: IPokemonSpecies = {
      id: 25,
      evolution_chain: { url: '' },
    };
    mockFetch(mockData);

    const data = await getPokemonSpecies(25);
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon-species/25');
  });

  test('getEvolutionChain fetches and returns data', async () => {
    const mockData = { chain: {} };
    const url = 'https://pokeapi.co/api/v2/evolution-chain/1';
    mockFetch(mockData);

    const data = await getEvolutionChain(url);
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  test('getMoveDetails fetches and returns data', async () => {
    const mockData: IMoveItem = {
      move: { name: 'thunderbolt', url: '' },
      type: { name: 'electric' },
    };
    const url = 'https://pokeapi.co/api/v2/move/85';
    mockFetch(mockData);

    const data = await getMoveDetails(url);
    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(url);
  });

  test('getMoveDetails throws error when response not ok', async () => {
    const url = 'https://pokeapi.co/api/v2/move/85';
    mockFetch({}, false, 'Not Found');

    await expect(getMoveDetails(url)).rejects.toThrow('Failed to fetch move details');
  });
});
