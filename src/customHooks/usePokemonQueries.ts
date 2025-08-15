import { useQueries, useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { IPokemonDetail } from '../types/pokemon';
import {
  getEvolutionChain,
  getPokemonDetail,
  getPokemonList,
  getPokemonSpecies,
} from '../api/pokemonApi';
import { IMoveItem } from '../components/MovesList/MovesList';

export interface IPokemonSpecies {
  id: number;
  evolution_chain?: { url: string } | null;
}

export interface IEvolutionNode {
  species: { name: string; url: string };
  evolves_to: IEvolutionNode[];
}

export interface IEvolutionChainResponse {
  chain: IEvolutionNode | null;
}

/**
 * Fetches a paginated list of Pokémon along with their detailed data.
 *
 * @param {number} limit - Number of Pokémon to fetch per page.
 * @param {number} offset - The offset for pagination (starting index).
 * @param {number} page - Current page number (used in query key).
 * @returns {{
 *   pokemonListQuery: UseQueryResult<IPokemonListResponse>,
 *   detailQueries: UseQueryResult<IPokemonDetail>[]
 * }} An object containing:
 *  - `pokemonListQuery`: The main Pokémon list query result.
 *  - `detailQueries`: Array of detailed Pokémon queries for each item in the list.
 */
export const usePokemonList = (limit: number, offset: number, page: number) => {
  const pokemonListQuery = useQuery({
    queryKey: ['pokemonList', page],
    queryFn: () => getPokemonList(limit, offset),
    staleTime: 1000 * 60 * 5,
  });
  const detailQueries = useQueries({
    queries: (pokemonListQuery?.data?.results || []).map((p) => ({
      queryKey: ['pokemonDetail', p.name],
      enabled: !!pokemonListQuery?.data,
      queryFn: () => getPokemonDetail(p.name),
      staleTime: 1000 * 60 * 5,
    })),
  });
  return { pokemonListQuery, detailQueries };
};

/**
 * Fetches additional details for a Pokémon, including species and evolution chain.
 *
 * @param {string | undefined} nameOrId - Pokémon name or ID.
 * @param {IPokemonDetail | undefined} detailQuery - Pokémon detail data used to extract ID.
 * @returns {{
 *   speciesQuery: UseQueryResult<IPokemonSpecies | null>,
 *   evolutionQuery: UseQueryResult<IEvolutionChainResponse | null>
 * }} An object containing:
 *  - `speciesQuery`: Query result for Pokémon species data.
 *  - `evolutionQuery`: Query result for Pokémon evolution chain.
 */
export const usePokemonDetailQuery = (
  nameOrId: string | undefined,
  detailQuery: IPokemonDetail | undefined
) => {
  const speciesQuery = useQuery<IPokemonSpecies | null>({
    queryKey: ['pokemonSpecies', nameOrId],
    enabled: !!detailQuery,
    queryFn: async () => {
      const id = detailQuery?.id;
      if (typeof id !== 'number') return null;
      return getPokemonSpecies(id);
    },
    staleTime: 1000 * 60 * 5,
  });

  const evolutionQuery = useQuery<IEvolutionChainResponse | null>({
    queryKey: ['evolutionChain', speciesQuery.data?.evolution_chain?.url],
    enabled: !!speciesQuery.data?.evolution_chain?.url,
    queryFn: async () => {
      const url = speciesQuery.data?.evolution_chain?.url;
      if (!url) return null;
      return getEvolutionChain(url);
    },
    staleTime: 1000 * 60 * 5,
  });

  return { speciesQuery, evolutionQuery };
};

/**
 * Fetches detailed move data for a given list of Pokémon moves.
 *
 * @param {IMoveItem[]} moves - Array of move objects containing move name and URL.
 * @returns {{
 *   moveQueries: UseQueryResult<IMoveItem>[],
 *   fetchedMoves: IMoveItem[]
 * }} An object containing:
 *  - `moveQueries`: Array of move queries (one per move).
 *  - `fetchedMoves`: Array of successfully fetched move data.
 */
export const usePokemonMoveQuery = (moves: IMoveItem[]) => {
  const queries = useQueries({
    queries: moves.map((m) => ({
      queryKey: ['move', m.move.name],
      queryFn: async (): Promise<IMoveItem> => {
        const res = await fetch(m.move.url);
        if (!res.ok) throw new Error('Failed to fetch move data');
        const data = await res.json();
        return {
          move: { name: m.move.name, url: m.move.url },
          type: { name: data.type.name },
        };
      },
      staleTime: 1000 * 60 * 5,
    })),
  }) as UseQueryResult<IMoveItem>[];

  const fetchedMoves = queries.filter((q) => q.isSuccess && q.data).map((q) => q.data!);

  return {
    moveQueries: queries,
    fetchedMoves,
  };
};
