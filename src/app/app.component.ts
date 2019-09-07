import { Component } from '@angular/core';
import { AlgorithmService } from './services/algorithm.service';
import { createPokeCount, PokeCount } from './models/poke-count';
import { Pokemon } from './models/pokemon';
import { BreedingService } from './services/breeding.service';
import { BreedingResult } from './models/breeding-result';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public bredPokemon: BreedingResult;

  constructor(private algorithm: AlgorithmService,
              private breedService: BreedingService) {

  }

  public calculate(result: {pokeCount: PokeCount, pokemon: Pokemon}) {
    console.log(result.pokeCount);
    console.log(result.pokemon);
    this.bredPokemon = this.breedService.calculate(result.pokeCount, result.pokemon);
    console.log(this.bredPokemon);
  }
}
