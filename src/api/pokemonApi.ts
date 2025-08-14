import { IMoveItem } from '../components/MovesList/MovesList';
import type { IPokemonSpecies } from '../customHooks/usePokemonQueries';
import type { IPokemonDetail, IPokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (
  limit: number,
  offset: number
): Promise<IPokemonListResponse> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getPokemonDetail = async (nameOrId: string): Promise<IPokemonDetail> => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon detail: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getPokemonSpecies = async (id: number): Promise<IPokemonSpecies> => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getEvolutionChain = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const getMoveDetails = async (url: string): Promise<IMoveItem> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch move details');
  const data = await response.json();
  return data;
};
