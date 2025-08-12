import { useQueries, useQuery } from '@tanstack/react-query';
import type { IPokemonDetail } from '../types/pokemon';
import {
  getEvolutionChain,
  getPokemonDetail,
  getPokemonList,
  getPokemonSpecies,
} from '../api/pokemonApi';

export interface IPokemonSpecies {
  id: number;
  evolution_chain?: { url: string } | null;
}

export interface EvolutionNode {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
}

export interface IEvolutionChainResponse {
  chain: EvolutionNode;
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
      queryFn: () => getPokemonDetail(p.name),
      enabled: !!pokemonListQuery?.data,
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
