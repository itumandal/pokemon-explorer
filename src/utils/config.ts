import type { IPokemonDetail } from '../types/pokemon';

export const createStatsMap = (pokemon?: IPokemonDetail) => {
  const statsMap = new Map<string, number>();
  pokemon?.stats?.forEach((s) => statsMap.set(s.stat.name, s.base_stat));
  return statsMap;
};
export function getStatValue(statsMap: Map<string, number>, keys: string[]): number {
  for (const key of keys) {
    if (statsMap.has(key)) return statsMap.get(key)!;
  }
  return 0;
}
export const STAT_CONFIG = [
  { label: 'HP', keys: ['hp'] },
  { label: 'Attack', keys: ['attack'] },
  { label: 'Defense', keys: ['defense'] },
  { label: 'Sp. Attack', keys: ['special-attack', 'sp. atk'] },
  { label: 'Sp. Defense', keys: ['special-defense', 'sp. def'] },
  { label: 'Speed', keys: ['speed'] },
];
