import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  getPokemons(offset: number, limit: number) {
    return axios.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }

  getPokemon(name: string) {
    return axios.get(`${this.baseUrl}/pokemon/${name}`);
  }

  getPokemonAbility(url: string) {
    return axios.get(url);
  }
}
