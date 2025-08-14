import { IMoveItem } from '../components/MovesList/MovesList';

export interface IPokemonListResult {
  name: string;
  url: string;
}

export interface IPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokemonListResult[];
}

export interface IPokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface IPokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface IPokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface IPokemonSprites {
  front_default: string;
  other?: {
    ['official-artwork']?: {
      front_default: string;
    };
  };
}

export interface IPokemonDetail {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: IPokemonType[];
  abilities: IPokemonAbility[];
  stats: IPokemonStat[];
  sprites: IPokemonSprites;
  moves?: IMoveItem[];
}
