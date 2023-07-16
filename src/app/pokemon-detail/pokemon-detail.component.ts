import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PokemonService } from '../pokemon.service';

// Types
import type { ChartConfiguration } from 'chart.js';
import type {
  Pokemon,
  PokemonAbility,
  PokemonEffectEntry,
  PokemonStat,
  StatName,
  StatsDatasets,
} from '../pokemon';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | undefined;

  // Stats Chart Configuration
  public statsChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };
  public statsChartLabels: string[] = [
    'HP',
    'Attack',
    'Defense',
    'Special Attack',
    'Special Defense',
    'Speed',
  ];
  public statsChartDatasets: StatsDatasets = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (!name) return;

    this.fetchPokemon(name);
  }

  async fetchPokemon(name: string) {
    try {
      const res = await this.pokemonService.getPokemon(name);
      const pokemon: Pokemon = res.data;

      // Get pokemon statistic datasets for chart
      this.statsChartDatasets = this.getPokemonStatsDatasets(pokemon);

      // Fetch ability detail, because we need the ability short description
      pokemon.abilities = await this.getPokemonComplexAbility(pokemon);

      this.pokemon = pokemon;
      this.titleService.setTitle(`${this.pokemon?.name} | Pokemon Detail`);
    } catch (error) {
      return;
    }
  }

  getPokemonAbilityDesc(ability: PokemonAbility): string {
    const entry = ability.effect_entries.filter(
      (entry: PokemonEffectEntry) => entry.language.name === 'en'
    )[0];

    return ability.ability.name + ': ' + entry.short_effect;
  }

  private getPokemonStatsDatasets(pokemon: Pokemon): StatsDatasets {
    return [
      {
        data: [
          this.getPokemonBaseStat(pokemon, 'hp'), // HP
          this.getPokemonBaseStat(pokemon, 'attack'), // Attack
          this.getPokemonBaseStat(pokemon, 'defense'), // Defense
          this.getPokemonBaseStat(pokemon, 'special-attack'), // Special Attack
          this.getPokemonBaseStat(pokemon, 'special-defense'), // Special Defense
          this.getPokemonBaseStat(pokemon, 'speed'), // Speed
        ],
        label: pokemon.name,
        fill: true,
      },
    ];
  }

  private getPokemonBaseStat(pokemon: Pokemon, statName: StatName): number {
    return pokemon.stats.filter(
      (stat: PokemonStat) => stat.stat.name === statName
    )[0].base_stat;
  }

  private async getPokemonComplexAbility(
    pokemon: Pokemon
  ): Promise<PokemonAbility[]> {
    const complexAbilities = [];

    for (const ability of pokemon.abilities) {
      const res = await this.pokemonService.getPokemonAbility(
        ability.ability.url
      );

      complexAbilities.push({ ...ability, ...res.data });
    }

    return complexAbilities;
  }
}
