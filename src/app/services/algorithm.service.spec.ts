import { TestBed } from '@angular/core/testing';

import { AlgorithmService } from './algorithm.service';
import { createPokemon, Pokemon } from '../models/pokemon';
import { createPokeCount } from '../models/poke-count';

describe('AlgorithmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    expect(service).toBeTruthy();
  });

  it('return what is asked for', () => {
    let endResult = true;
    for (let i = 0; i < 100; i++) {
      const service: AlgorithmService = TestBed.get(AlgorithmService);
      const pokemon: Pokemon = {
        HP: Math.random() >= 0.5,
        Atk: Math.random() >= 0.5,
        Def: Math.random() >= 0.5,
        SpA: Math.random() >= 0.5,
        SpD: Math.random() >= 0.5,
        Ini: Math.random() >= 0.5
      };
      const count = wantedPokemonCount(pokemon);
      const ret = service.calculate(createPokeCount(10, 10, 10, 10, 10, 10, 10, 10, 10, 10 , 10, 10), pokemon);
      let result = false;
      switch (count) {
        case 0:
          result = true;
          break;
        case 1:
          result = true;
          break;
        case 2:
          result = comparePokemon(pokemon, ret.twoStat[0]);
          break;
        case 3:
          result = comparePokemon(pokemon, ret.threeStat[0]);
          break;
        case 4:
          result = comparePokemon(pokemon, ret.fourStat[0]);
          break;
        case 5:
          result = comparePokemon(pokemon, ret.fiveStat[0]);
          break;
        case 6:
          result = comparePokemon(pokemon, ret.sixStat[0]);
          break;
      }
      endResult = endResult && result;
      if (endResult === false) {
        console.log(ret.twoStat);
        console.log(ret.threeStat);
        console.log(ret.fourStat);
        console.log(ret.fiveStat);
        console.log(ret.sixStat);
        console.log(pokemon);
        console.log(service.wantedPokemon);

        console.log(`case: ${count}`);
        console.log(`at ${i + 1}th test`);
        break;
      }

    }
    expect(endResult).toBeTruthy();
  });

  function comparePokemon(pokemon1: Pokemon, pokemon2: Pokemon): boolean {
    let compare = true;
    for (const property in pokemon1) {
      if (pokemon1[property] !== pokemon2[property]) {
        console.log('pokemon 1: ' + JSON.stringify(pokemon1));
        console.log('pokemon 2: ' + JSON.stringify(pokemon2));
        compare = false;
        break;
      }
    }
    return compare;
  }

  function wantedPokemonCount(wantedPokemon) {
    let count = 0;
    for (let p in wantedPokemon) {
      if (wantedPokemon.hasOwnProperty(p) && wantedPokemon[p] === true) {
        count++;
      }
    }
    return count;
  }
});
