import { createStatsMap, getStatValue, STAT_CONFIG } from './config';
import type { IPokemonDetail } from '../types/pokemon';

describe('config utils', () => {
  const mockPokemon: IPokemonDetail = {
    id: 25,
    name: 'pikachu',
    base_experience: 112,
    height: 4,
    weight: 60,
    types: [],
    abilities: [],
    stats: [
      { base_stat: 50, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 90, effort: 0, stat: { name: 'speed', url: '' } },
    ],
    sprites: { front_default: 'pikachu.png' },
  };

  test('createStatsMap returns correct Map', () => {
    const map = createStatsMap(mockPokemon);
    expect(map.get('hp')).toBe(50);
    expect(map.get('attack')).toBe(55);
    expect(map.get('speed')).toBe(90);
  });

  test('createStatsMap handles undefined pokemon', () => {
    const map = createStatsMap(undefined);
    expect(map.size).toBe(0);
  });

  test('getStatValue returns correct value for first matching key', () => {
    const map = createStatsMap(mockPokemon);
    const value = getStatValue(map, ['speed', 'attack']);
    expect(value).toBe(90);
  });

  test('getStatValue returns 0 if no keys match', () => {
    const map = createStatsMap(mockPokemon);
    const value = getStatValue(map, ['nonexistent', 'another']);
    expect(value).toBe(0);
  });

  test('STAT_CONFIG has all expected labels', () => {
    const labels = STAT_CONFIG.map((s) => s.label);
    expect(labels).toEqual(['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed']);
  });
});
