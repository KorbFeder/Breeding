import { Component } from '@angular/core';
import { AlgorithmService } from './services/algorithm.service';
import { createPokeCount, PokeCount } from './models/poke-count';
import { Pokemon } from './models/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public bredPokemon: {
    oneStatMale: Pokemon[],
    oneStatFemale: Pokemon[],
    twoStat: Pokemon[],
    threeStat: Pokemon[],
    fourStat: Pokemon[],
    fiveStat: Pokemon[],
    sixStat: Pokemon[],
    count: PokeCount
};

  constructor(private algorithm: AlgorithmService) {

    const pokemon: Pokemon = {
      HP: true,
      Atk: true,
      Def: true,
      SpA: true,
      SpD: true,
      Ini: false
    };
    const poke = createPokeCount(4, 6, 5, 4, 3, 6, 5, 2, 9, 4, 5, 6);
    let ret;
    try {
      ret = algorithm.calculate(poke, pokemon);
      console.log(ret.twoStat);
      console.log(ret.threeStat);
      console.log(ret.fourStat);
      console.log(ret.fiveStat);
      console.log(ret.sixStat);
    } catch (e) {
      console.log(e);
    }
 }

  public calculate(result: {pokeCount: PokeCount, pokemon: Pokemon}) {
    console.log(result.pokeCount);
    console.log(result.pokemon);
    this.bredPokemon = this.algorithm.calculate(result.pokeCount, result.pokemon);
    console.log(this.bredPokemon);
  }
}
