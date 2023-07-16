import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  limit: number = 25;
  loading: boolean = false;
  pokemons: Pokemon[] = [];

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPokemons();
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

  toPokemonDetailPage(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.name]);
  }

  onScroll() {
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

interface Pokemon {
  name: string;
  url: string;
}
