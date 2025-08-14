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
  chain: IEvolutionNode;
}

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

  const fetchedMoves = queries
    .filter(
      (query): query is UseQueryResult<IMoveItem> & { data: IMoveItem } =>
        query.isSuccess && query.data !== undefined
    )
    .map((query) => query.data);

  return {
    moveQueries: queries,
    fetchedMoves,
  };
};
