import type { IMoveItem } from '../components/MovesList';
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

export const getPokemonSpecies = async (id: number) => {
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
  return response.json() as Promise<IMoveItem>;
};
