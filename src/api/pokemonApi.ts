import { IMoveItem } from '../components/MovesList/MovesList';
import type { IPokemonSpecies } from '../customHooks/usePokemonQueries';
import type { IPokemonDetail, IPokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a paginated list of Pokémon.
 *
 * @param {number} limit - Number of Pokémon to fetch per request.
 * @param {number} offset - Starting index for fetching Pokémon.
 * @returns {Promise<IPokemonListResponse>} Resolves with the Pokémon list response.
 * @throws Will throw an error if the request fails or returns a non-OK status.
 */
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

/**
 * Fetches detailed data of a Pokémon by name or ID.
 *
 * @param {string} nameOrId - Pokémon's name (e.g., "pikachu") or numeric ID.
 * @returns {Promise<IPokemonDetail>} Resolves with detailed Pokémon data.
 * @throws Will throw an error if the request fails or returns a non-OK status.
 */
export const getPokemonDetail = async (nameOrId: string): Promise<IPokemonDetail> => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon detail: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

/**
 * Fetches species information for a specific Pokémon.
 *
 * @param {number} id - Numeric ID of the Pokémon.
 * @returns {Promise<IPokemonSpecies>} Resolves with Pokémon species data.
 * @throws Will throw an error if the request fails or returns a non-OK status.
 */
export const getPokemonSpecies = async (id: number): Promise<IPokemonSpecies> => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

/**
 * Fetches the evolution chain data using a provided URL.
 *
 * @param {string} url - API endpoint for the evolution chain.
 * @returns {Promise<any>} Resolves with evolution chain data (structure depends on API).
 * @throws Will throw an error if the request fails or returns a non-OK status.
 */
export const getEvolutionChain = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
/**
 * Fetches details of a specific Pokémon move.
 *
 * @param {string} url - API endpoint for the move details.
 * @returns {Promise<IMoveItem>} Resolves with move detail data.
 * @throws Will throw an error if the request fails or returns a non-OK status.
 */
export const getMoveDetails = async (url: string): Promise<IMoveItem> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch move details');
  const data = await response.json();
  return data;
};
