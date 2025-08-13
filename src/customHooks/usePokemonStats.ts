import { useMemo } from 'react';
import type { IPokemonDetail } from '../types/pokemon';

export interface IPokemonDerivedStats {
  hp: number;
  speed: number;
  primaryAbility: string;
  typeList: string[];
}

export const usePokemonStats = (pokemon?: IPokemonDetail): IPokemonDerivedStats => {
  return useMemo(() => {
    if (!pokemon) {
      return {
        hp: 0,
        speed: 0,
        primaryAbility: '',
        typeList: [],
      };
    }

    const hp = pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat ?? 0;
    const speed = pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat ?? 0;
    const primaryAbility = pokemon.abilities[0]?.ability.name ?? 'Unknown';
    const typeList = pokemon.types.map((t) => t.type.name);

    return {
      hp,
      speed,
      primaryAbility,
      typeList,
    };
  }, [pokemon]);
};
