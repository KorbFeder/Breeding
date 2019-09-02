import { Injectable } from '@angular/core';
import { Pokemon, createPokemon, combinePokemon } from '../models/pokemon';
import { PokeCount, StatCount, PokeStats } from '../models/poke-count';


@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  constructor() { }

  public calculate(pokeCount: PokeCount) {
    const {male: maleOne, female: femaleOne} = this.choosePokemon(pokeCount);
    const twoStat = combinePokemon(maleOne, femaleOne);
    const invTwoStat = this.buildPool(twoStat);

    const {male: maleTwo, female: femaleTwo} = this.choosePokemon(pokeCount, twoStat, invTwoStat);
    const secTwoStat = combinePokemon(maleTwo, femaleTwo);
    const threeStat = combinePokemon(twoStat, secTwoStat);

    const {male: maleThree, female: femaleThree} = this.choosePokemon(pokeCount, threeStat, this.buildPool(threeStat));
    console.log({male: maleThree, female: femaleThree});
  }

  private buildPool(pkmn: Pokemon): Pokemon {
    const ret = Object.assign({}, pkmn);
    for (let p in pkmn) {
      if (pkmn.hasOwnProperty(p)) {
        ret[p] = !pkmn[p];
      }
    }
    return ret;
  }

  private choosePokemon(pokeCount: PokeCount, statRestrFirst: Pokemon = null, statRestrSec: Pokemon = null, bothPools: boolean = false) {
    pokeCount.male.sort(this.comparator);
    pokeCount.female.sort(this.comparator);

    if (statRestrFirst != null && statRestrSec != null) {
      let male = pokeCount.male[0];
      let female = pokeCount.female[0];

      let alreadySetStatFemale = [...pokeCount.female].filter((stat) => statRestrFirst[stat.pokeStat]);
      let alreadySetStatMale = [...pokeCount.male].filter((stat) => statRestrFirst[stat.pokeStat]);
      let unsetStatFemale = [...pokeCount.female].filter((stat) => statRestrSec[stat.pokeStat]);
      let unsetStatMale = [...pokeCount.male].filter((stat) => statRestrSec[stat.pokeStat]);

      if (bothPools) {
        if (!(alreadySetStatFemale.filter((x) => x.pokeStat === female.pokeStat).length > 0) &&
          !(alreadySetStatMale.filter((x) => x.pokeStat === male.pokeStat).length > 0)) {
          // Filter out old stat, so they array has a new max, if it is contained in the array
          unsetStatFemale = unsetStatFemale.filter(x => x.pokeStat !== female.pokeStat);
          unsetStatMale = unsetStatMale.filter(x => x.pokeStat !== male.pokeStat);

          // Take the highest value from the other pool
          if (unsetStatFemale[0].count > unsetStatMale[0].count) {
            female = unsetStatFemale[0];
          } else if (unsetStatFemale[0].count < unsetStatMale[0].count) {
            male = unsetStatMale[0];
          } else {
            // If female and male are equal, than take either female or male, which has a higher total sum of pkmns
            let maleSum = 0;
            let femaleSum = 0;
            for (let i = 0; i < pokeCount.male.length; i++) {
              maleSum += pokeCount.male[i].count;
              femaleSum += pokeCount.female[i].count;
            }
            if (maleSum >= femaleSum) {
              male = unsetStatMale[0];
            } else {
              female = unsetStatFemale[0];
            }
          }
        }
        male.count--;
        female.count--;
        return {male: createPokemon(male.pokeStat), female: createPokemon(female.pokeStat)};
      }

      // Case, when both male and female are in the same pool already set
      if (alreadySetStatFemale.filter((x) => x.pokeStat === female.pokeStat).length > 0 &&
          alreadySetStatMale.filter((x) => x.pokeStat === male.pokeStat).length > 0) {

        // Filter out old stat, so they array has a new max, if it is contained in the array
        unsetStatFemale = unsetStatFemale.filter(x => x.pokeStat !== female.pokeStat);
        unsetStatMale = unsetStatMale.filter(x => x.pokeStat !== male.pokeStat);

        // Take the highest value from the other pool
        if (unsetStatFemale[0].count > unsetStatMale[0].count) {
          female = unsetStatFemale[0];
        } else if (unsetStatFemale[0].count < unsetStatMale[0].count) {
          male = unsetStatMale[0];
        } else {
          // If female and male are equal, than take either female or male, which has a higher total sum of pkmns
          let maleSum = 0;
          let femaleSum = 0;
          for (let i = 0; i < pokeCount.male.length; i++) {
            maleSum += pokeCount.male[i].count;
            femaleSum += pokeCount.female[i].count;
          }
          if (maleSum >= femaleSum) {
            male = unsetStatMale[0];
          } else {
            female = unsetStatFemale[0];
          }
        }
      // Case, when both male and female are in the same pool unset
      } else if (unsetStatFemale.filter((x) => x.pokeStat === female.pokeStat).length > 0 &&
        unsetStatMale.filter((x) => x.pokeStat === male.pokeStat). length > 0) {

        // Filter out old stat, so they array has a new max, if it is contained in the array
        alreadySetStatFemale = alreadySetStatFemale.filter(x => x.pokeStat !== female.pokeStat);
        alreadySetStatMale = alreadySetStatMale.filter(x => x.pokeStat !== female.pokeStat);

        // Take the highest value from the other pool
        if (alreadySetStatFemale[0].count > alreadySetStatMale[0].count) {
          female = alreadySetStatFemale[0];
        } else if (alreadySetStatFemale[0].count < alreadySetStatMale[0].count) {
          male = alreadySetStatMale[0];
        } else {
          // If female and male are equal, than take either female or male, which has a higher total sum of pkmns
          let maleSum = 0;
          let femaleSum = 0;
          for (let i = 0; i < pokeCount.male.length; i++) {
            maleSum += pokeCount.male[i].count;
            femaleSum += pokeCount.female[i].count;
          }
          if (maleSum >= femaleSum) {
            male = alreadySetStatMale[0];
          } else {
            female = alreadySetStatFemale[0];
          }
        }

      // Case, when male and female are in different pools
      }
      male.count--;
      female.count--;
      return {male: createPokemon(male.pokeStat), female: createPokemon(female.pokeStat)};
    } else {
      let firstFemale = pokeCount.female[0];
      let firstMale = pokeCount.male[0];

      if (firstFemale.pokeStat === firstMale.pokeStat) {
        const secOption = this.comparator(pokeCount.female[1], pokeCount.male[1]);
        if (secOption === -1) {
          firstFemale = pokeCount.female[1];
        }
        if (secOption === 1) {
          firstMale = pokeCount.male[1];
        }
        if (secOption === 0) {
          let maleSum = 0;
          let femaleSum = 0;
          for (let i = 0; i < pokeCount.male.length; i++) {
            maleSum += pokeCount.male[i].count;
            femaleSum += pokeCount.female[i].count;
          }
          if (maleSum >= femaleSum) {
            firstMale = pokeCount.male[1];
          } else {
            firstFemale = pokeCount.female[1];
          }
        }
      }
      // take out of the pokemon pool
      firstFemale.count--;
      firstMale.count--;
      return {male: createPokemon(firstMale.pokeStat), female: createPokemon(firstFemale.pokeStat)};
    }
  }

  private comparator(a: StatCount, b: StatCount): number {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    return 0;
  }
}
