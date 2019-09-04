import { Injectable } from '@angular/core';
import { Pokemon, createPokemon, combinePokemon } from '../models/pokemon';
import { PokeCount, StatCount, PokeStats } from '../models/poke-count';


@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  female: StatCount;
  male: StatCount;

  bothUsed = false;

  constructor() { }

  public calculate(pokeCount: PokeCount) {
    let male: Pokemon;
    let female: Pokemon;
    let pool1: Pokemon;
    let pool2: Pokemon;
    const twoStatPokemon: Pokemon[] = [];
    const threeStatPokemon: Pokemon[] = [];
    const fourStatPokemon: Pokemon[] = [];
    const fiveStatPokemon: Pokemon[] = [];

    ({male, female} = this.choosePokemon(pokeCount));
    twoStatPokemon.push(combinePokemon(male, female));

    ({male, female} = this.choosePokemon(pokeCount, twoStatPokemon[0], this.invertPkmToPool(twoStatPokemon[0])));
    twoStatPokemon.push(combinePokemon(male, female));
    threeStatPokemon.push(combinePokemon(twoStatPokemon[0], twoStatPokemon[1]));

    this.bothUsed = false;
    ({male, female} = this.choosePokemon(pokeCount, threeStatPokemon[0], this.invertPkmToPool(threeStatPokemon[0]), true));
    twoStatPokemon.push(combinePokemon(male, female));
    ({pool1, pool2} = this.createPools(threeStatPokemon[0], twoStatPokemon[2]));

    ({male, female} = this.choosePokemon(pokeCount, pool1, pool2, true));
    twoStatPokemon.push(combinePokemon(male, female));

    threeStatPokemon.push(combinePokemon(twoStatPokemon[3], twoStatPokemon[2]));

    fourStatPokemon.push(combinePokemon(threeStatPokemon[0], threeStatPokemon[1]));

    ({male, female} = this.choosePokemon(pokeCount, fourStatPokemon[0], this.invertPkmToPool(fourStatPokemon[0])));
    twoStatPokemon.push(combinePokemon(male, female));
    ({pool1, pool2} = this.createPools(fourStatPokemon[0], twoStatPokemon[4]));

    ({male, female} = this.choosePokemon(pokeCount, pool1, pool2));
    twoStatPokemon.push(combinePokemon(male, female));

    threeStatPokemon.push(combinePokemon(twoStatPokemon[4], twoStatPokemon[5]));

    this.bothUsed = false;
    ({male, female} = this.choosePokemon(pokeCount, threeStatPokemon[2], this.invertPkmToPool(threeStatPokemon[2]), true));
    twoStatPokemon.push(combinePokemon(male, female));
    ({pool1, pool2} = this.createPools(threeStatPokemon[2], twoStatPokemon[6]));

    ({male, female} = this.choosePokemon(pokeCount, pool1, pool2, true));
    twoStatPokemon.push(combinePokemon(male, female));

    threeStatPokemon.push(combinePokemon(twoStatPokemon[6], twoStatPokemon[7]));

    fiveStatPokemon.push(combinePokemon(threeStatPokemon[3], threeStatPokemon[2]));

    console.log(fiveStatPokemon);
  }

  private createThreeStatPokemon(pokeCount: PokeCount, pokemon: Pokemon, bothPools = false) {
    let male: Pokemon;
    let female: Pokemon;
    const twoStatPokemon: Pokemon[] = [];
    const threeStatPokemon: Pokemon[] = [];

    this.bothUsed = false;
    ({male, female} = this.choosePokemon(pokeCount, pokemon, this.invertPkmToPool(pokemon), bothPools));
    twoStatPokemon.push(combinePokemon(male, female));
    const {pool1, pool2} = this.createPools(pokemon, twoStatPokemon[0]);

    ({male, female} = this.choosePokemon(pokeCount, pool1, pool2, bothPools));
    twoStatPokemon.push(combinePokemon(male, female));

    threeStatPokemon.push(combinePokemon(twoStatPokemon[0], twoStatPokemon[1]));

    return {threeStatPokemon, twoStatPokemon};
  }

  /**
   * This function creates 2 pools for the next choosePokemon call, it also depends on the
   * bothUsed Flag.
   * Main usage is when a new pokemon is dependent on a 3 or 4 stat pokemon from before.
   * It returns 2 pools.
   * 
   * @param pool_1 pool that gets a copy of an altered pool, always the bigger pool
   * @param pool_2 smaller pool
   */
  private createPools(pool_1: Pokemon, pool_2: Pokemon) {
    let pool1 = Object.assign({}, pool_1);
    const pool2 = Object.assign({}, pool_2);
    if (this.bothUsed === true) {
      pool1 = this.invertPkmToPool(pool1);
    } else {
      for (const key in pool1) {
        if (pool1[key] && pool2[key]) {
          pool1[key] = false;
        }
      }
    }
    return {pool1, pool2};
  }

  /**
   * This function choses a pokemon and returns a male and a female pokemon which got chosen.
   * It has 3 optional parameters. If both the of the stat restriction parameters are filled out, than
   * there will be 2 pools of stats created of which the pokemon can have one stat, for example:
   * Pool 1:          Pool2:
   * Hp, Atk, Ini     Def, SpA, SpD
   * now the male pokemon can be of pool 1 and the female of pool 2 or the other way around but both cannot be in the same pool.
   * The first pool is the pool which is depending on the which stats from the next partner are already set, for example:
   * Next partner:
   * Hp: false
   * Atk: false
   * Def: true
   * SpA: true
   * SpD: false
   * Ini: true
   * Than pool 1 would have Def, SpA and Ini, of which one of the pokemon has to have one, pool 2 will have the rest of which
   * the other pokemon has to have one.
   * If the bothPools flag is set, than Both pokemon can be of pool 1.
   * 
   * @param pokeCount the Pokecount Object, that holds the amount of current breeders
   * @param statRestrFirst Restriction on which stats the pools will have (optional)
   * @param statRestrSec Second Restriction for the pools (optional)
   * @param bothPools flag if the pokemon is allowed to have parents of the same pool (optional)
   */
  private choosePokemon(pokeCount: PokeCount, statRestrFirst: Pokemon = null, statRestrSec: Pokemon = null, bothPools: boolean = false) {
    // Sorts the array after the pokemon with the highest count at position 0
    pokeCount.male.sort(this.comparator);
    pokeCount.female.sort(this.comparator);

    this.male = pokeCount.male[0];
    this.female = pokeCount.female[0];

    // If the stats can't be chosen at will this case does the restrictions
    if (statRestrFirst != null && statRestrSec != null) {

      // Creating pools for the stats, which restrict the stats
      const alreadySetStatFemale = [...pokeCount.female].filter((stat) => statRestrFirst[stat.pokeStat]);
      const alreadySetStatMale = [...pokeCount.male].filter((stat) => statRestrFirst[stat.pokeStat]);
      const unsetStatFemale = [...pokeCount.female].filter((stat) => statRestrSec[stat.pokeStat]);
      const unsetStatMale = [...pokeCount.male].filter((stat) => statRestrSec[stat.pokeStat]);

      // Check if there was the rule that both were used before
      if (this.bothUsed === true) {
        this.bothUsed = false;
        bothPools = false;
      }
      // This case happens if the pokemon is allowed to have 2 parents from the already set pool
      if (bothPools) {
        if (!(alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0) &&
          !(alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0)) {

            this.movePools(unsetStatFemale, unsetStatMale, pokeCount);
        } else if ((alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0) &&
          (alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0)) {

            this.bothUsed = true;
        }
        this.chooseNextHighestIfEqual(pokeCount);
     // This case happens if a pokemon has 2 parents in the already set pool, than one gets moved to the other pool
     } else if (alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0 &&
      alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0) {

        this.movePools(unsetStatFemale, unsetStatMale, pokeCount);

      // This case happens if a pokemon has 2 parents in the unset pool, than one gets moved to the other pool
      } else if (unsetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0 &&
      unsetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0) {

        this.movePools(alreadySetStatFemale, alreadySetStatMale, pokeCount);
      }

    } else {
      this.chooseNextHighestIfEqual(pokeCount);
    }
    this.male.count--;
    this.female.count--;
    return {male: createPokemon(this.male.pokeStat), female: createPokemon(this.female.pokeStat)};

  }

  /**
   * This function only does something if the 2 pokemon chosen, have the same stat.
   * Pokemon 1 -> SpA, Pokemon 2 -> SpA
   * Than one of the pokemon gets a new stat.
   * 
   * @param pokeCount The pokeCount object which has the current amount of breeders
   */
  private chooseNextHighestIfEqual(pokeCount) {
    if (this.female.pokeStat === this.male.pokeStat) {
      // Checks the second highest stat of both
      const secOption = this.comparator(pokeCount.female[1], pokeCount.male[1]);
      // Case when the females Pokemons second highest stat is higher than the male ones
      if (secOption === -1) {
        this.female = pokeCount.female[1];
      }
      // Case when the females Pokemons second highest stat is higher than the male ones
      if (secOption === 1) {
        this.male = pokeCount.male[1];
      }
      // Case where both the second highest stat are equal, will take the one who has more breeders
      if (secOption === 0) {
        let maleSum = 0;
        let femaleSum = 0;
        for (let i = 0; i < pokeCount.male.length; i++) {
          maleSum += pokeCount.male[i].count;
          femaleSum += pokeCount.female[i].count;
        }
        if (maleSum >= femaleSum) {
          this.male = pokeCount.male[1];
        } else {
          this.female = pokeCount.female[1];
        }
      }
    }
  }

  /**
   * This function choses one pokemon from the other pool, depending on the amount of breeders available.
   * 
   * @param movedToPoolFemale The pool in which the pokemon gets chosen from if its female
   * @param movedToPoolMale  The pool in which the pokemon gets chosen from if its male
   * @param pokeCount The current count of available breeders
   */
  private movePools(movedToPoolFemale, movedToPoolMale, pokeCount: PokeCount) {
    // Filter out old stat, so they array has a new max, if it is contained in the array
    movedToPoolFemale = movedToPoolFemale.filter(x => x.pokeStat !== this.female.pokeStat);
    movedToPoolMale = movedToPoolMale.filter(x => x.pokeStat !== this.male.pokeStat);

    // Take the highest value from the other pool
    if (movedToPoolFemale[0].count > movedToPoolMale[0].count) {
      this.female = movedToPoolFemale[0];
    } else if (movedToPoolFemale[0].count < movedToPoolMale[0].count) {
      this.male = movedToPoolMale[0];
    } else {
      // If female and male are equal, than take either female or male, which has a higher total sum of pkmns
      let maleSum = 0;
      let femaleSum = 0;
      for (let i = 0; i < pokeCount.male.length; i++) {
        maleSum += pokeCount.male[i].count;
        femaleSum += pokeCount.female[i].count;
      }
      if (maleSum >= femaleSum) {
        this.male = movedToPoolMale[0];
      } else {
        this.female = movedToPoolFemale[0];
      }
    }
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
