import type { ChartConfiguration } from 'chart.js';

export interface Pokemon {
  name: string;
  url: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

interface PokemonSprites {
  other: {
    dream_world: {
      front_default: string;
    };
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  effect_entries: PokemonEffectEntry[];
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: StatName;
  };
}

export interface PokemonEffectEntry {
  language: {
    name: string;
  };
  short_effect: string;
}

export type StatsDatasets = ChartConfiguration<'radar'>['data']['datasets'];

export type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';
