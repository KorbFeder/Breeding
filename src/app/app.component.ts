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
    const poke = createPokeCount(1, 2, 3, 4, 9, 1, 0, 1, 0, 2, 9, 4);
    let ret;
    try {
      ret = algorithm.calculate(poke, pokemon);
    } catch (e) {
      console.log('exception, no more breeders');
    }
    console.log(ret.twoStat);
    console.log(ret.threeStat);
    console.log(ret.fourStat);
    console.log(ret.fiveStat);
    console.log(ret.sixStat);
  }
}
