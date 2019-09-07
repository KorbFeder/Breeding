import { Injectable } from '@angular/core';
import { PokeCount, StatCount } from '../models/poke-count';
import { Pokemon, createPokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class BreedingService {
  private pokeCount: PokeCount;
  constructor() { }

  public calculate(pokeCount: PokeCount, pokemon: Pokemon) {
    this.pokeCount = pokeCount;
  }

  private createPools() {

  }

  private choosePokemon(alreadySetStat: Pokemon = null, notYetSetStat: Pokemon = null): {male: Pokemon, female: Pokemon} {
    this.pokeCount.female.sort(this.comparator);
    this.pokeCount.male.sort(this.comparator);

    let male = this.pokeCount.male[0];
    let female = this.pokeCount.female[0];

    // If there were pokemon input that restrict the choosing of the pokemon
    if (alreadySetStat && notYetSetStat) {
      // If both would have the 'already set stat'
      if (alreadySetStat[male.pokeStat] && alreadySetStat[female.pokeStat]) {
        ({male, female} = this.changeStats(alreadySetStat, notYetSetStat, male, female));
      // If both would have the 'not yet set stat'
      } else if (notYetSetStat[male.pokeStat] && notYetSetStat[female.pokeStat]) {
        ({male, female} = this.changeStats(notYetSetStat, alreadySetStat, male, female));
      }
    } else {
      // If both chosen pokemon share the same stat
      if (male.pokeStat === female.pokeStat) {
        const malePkmn = createPokemon(male.pokeStat);
        ({male, female} = this.changeStats(malePkmn , this.invertPkmToPool(malePkmn), male, female));
      }
    }
    return {male: createPokemon(male.pokeStat), female: createPokemon(female.pokeStat)};
  }

  private changeStats(fromStat: Pokemon, toStat: Pokemon, male: StatCount, female: StatCount): {male: StatCount, female: StatCount} {
    const toStatFemale = this.pokeCount.female.filter((stat) => toStat[stat.pokeStat]);
    const toStatMale = this.pokeCount.male.filter((stat) => toStat[stat.pokeStat]);
    const fromStatFemale = this.pokeCount.female.filter((stat) => fromStat[stat.pokeStat]);
    const fromStatMale = this.pokeCount.male.filter((stat) => fromStat[stat.pokeStat]);

    const weightFemaleTo = this.countPokeStats(toStatFemale) + toStatFemale[0].count;
    const weightFemaleFrom = this.countPokeStats(fromStatFemale) + fromStatFemale[0].count;
    const weightFemale = weightFemaleTo + weightFemaleFrom;

    const weightMaleTo = this.countPokeStats(toStatMale) + toStatMale[0].count;
    const weightMaleFrom = this.countPokeStats(fromStatMale) + fromStatMale[0].count;
    const weightMale = weightMaleFrom + weightMaleTo;

    // Search for the smallest of the 4 weights
    const femaleTo = 0;
    const femaleFrom = 1;
    const maleTo = 2;
    const maleFrom = 3;
    const weights = [weightFemaleTo, weightFemaleFrom, weightMaleTo, weightMaleFrom];

    let currMin = weights[0];
    let index = 0;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] < currMin) {
        currMin = weights[i];
        index = i;
      // checks if both there is a female group and a male group with the same lowest weight
      } else if (weights[i] === currMin) {
        if ((index === femaleTo || index === femaleFrom) && (i === maleTo || i === maleFrom)) {
          if (weightFemale > weightMale) {
            index = i;
            currMin = weights[i];
          }
        } else if ((index === maleTo || index === maleFrom) && (i === femaleFrom || i === femaleTo)) {
          if (weightMale > weightFemale) {
            index = i;
            currMin = weights[i];
          }
        }
      }
    }
    // move, that the min won't get chosen
    if (index === femaleTo) {
      male = toStatMale[0];
    } else if (index === femaleFrom) {
      female = toStatFemale[0];
    } else if (index === maleTo) {
      female = toStatFemale[0];
    } else if (index === maleFrom) {
      male = toStatMale[0];
    }
    return {male, female};
  }

  private countPokeStats(statsCount: StatCount[]): number {
    let count = 0;
    statsCount.forEach(stat => count += stat.count);
    return count;
  }

  /**
   * This function takes 2 StatCounts and compares them, and returns 1, -1 and 0
   * depending on the higher one.
   *
   * @param a StatCount one
   * @param b StatCount two
   */
  private comparator(a: StatCount, b: StatCount): number {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    return 0;
  }

  /**
   * Function that creates Pokemon with inverted stats, this is to have it easier to create pools.
   */
  private invertPkmToPool(pkmn: Pokemon): Pokemon {
    if (pkmn === null) {
      return null;
    }
    const ret = Object.assign({}, pkmn);
    for (let p in pkmn) {
      if (pkmn.hasOwnProperty(p)) {
        ret[p] = !pkmn[p];
      }
    }
    return ret;
  }
}
