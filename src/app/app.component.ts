import { Component } from '@angular/core';
import { AlgorithmService } from './services/algorithm.service';
import { createPokeCount } from './models/poke-count';
import { Pokemon } from './models/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Breeding';

  constructor(private algorithm: AlgorithmService) {
    const pokemon: Pokemon = {
      HP: true,
      Atk: true,
      Def: true,
      SpA: true,
      SpD: true,
      Ini: true
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
}
