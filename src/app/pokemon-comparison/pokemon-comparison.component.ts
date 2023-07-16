import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';

// Types
import type { ChartConfiguration } from 'chart.js';
import type { Pokemon, PokemonStat, StatName, StatsDatasets } from '../pokemon';

@Component({
  selector: 'app-pokemon-comparison',
  templateUrl: './pokemon-comparison.component.html',
  styleUrls: ['./pokemon-comparison.component.css'],
})
export class PokemonComparisonComponent implements OnInit {
  limit: number = 25;
  loading: boolean = false;
  pokemons: Pokemon[] = [];

  // Comparison
  selectedPokemons: (Pokemon | undefined)[] = [undefined, undefined];

  // Stats Chart Configuration
  public statsChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 120,
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
  public statsChartDatasets: StatsDatasets = [
    { data: [], label: 'Pokemon 1' },
    { data: [], label: 'Pokemon 2' },
  ];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.fetchPokemons();
  }

  async selectPokemon(pokemonName: string, position: 1 | 2) {
    const pokemon = await this.fetchPokemon(pokemonName);
    if (!pokemon) return;

    const datasets = [...this.statsChartDatasets];
    datasets[position - 1] = this.getPokemonStatsDataset(pokemon);
    this.statsChartDatasets = datasets;

    const selectedPokemons = [...this.selectedPokemons];
    selectedPokemons[position - 1] = pokemon;
    this.selectedPokemons = selectedPokemons;
  }

  private async fetchPokemon(name: string) {
    try {
      const res = await this.pokemonService.getPokemon(name);
      const pokemon: Pokemon = res.data;
      return pokemon;
    } catch (error) {
      return;
    }
  }

  private getPokemonStatsDataset(pokemon: Pokemon): any {
    return {
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
    };
  }

  getPokemonBaseStat(pokemon: Pokemon, statName: StatName): number {
    return pokemon.stats.filter(
      (stat: PokemonStat) => stat.stat.name === statName
    )[0].base_stat;
  }

  fetchPokemons() {
    this.loading = true;
    this.pokemonService
      .getPokemons(this.pokemons.length, this.limit)
      .then((response) => {
        this.pokemons = this.pokemons.concat(response.data.results);
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.loading = false;
      });
  }

  onLoadMore() {
    if (this.loading) return;
    this.fetchPokemons();
  }

  getPokemonImgUrl(pokemon: Pokemon): string {
    return (
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/' +
      this.getPokemonId(pokemon) +
      '.svg'
    );
  }

  private getPokemonId(pokemon: Pokemon): string {
    const regex = /\/(\d+)\/$/;
    const match = pokemon.url.match(regex);
    if (match) return match[1];

    return '';
  }
}
