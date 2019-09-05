import { Injectable } from '@angular/core';
import { Pokemon, createPokemon, combinePokemon } from '../models/pokemon';
import { PokeCount, StatCount, PokeStats } from '../models/poke-count';


@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  female: StatCount;
  male: StatCount;

  twoStatPokemon: Pokemon[] = [];
  threeStatPokemon: Pokemon[] = [];
  fourStatPokemon: Pokemon[] = [];
  fiveStatPokemon: Pokemon[] = [];
  sixStatPokemon: Pokemon[] = [];

  wantedPokemon: Pokemon;

  bothUsed = false;

  constructor() { }

  /**
   * Function that calculates the breeding of a pokemon.
   * Depending on the wantedPkmn, there will be breeders used accordingly.
   * Returns an object which holds all 6 arrays of bred pokemon.
   * 
   * @param pokeCount The amount of breeders available
   * @param wantedPkmn The Pokemon wanted to be created
   */
  public calculate(pokeCount: PokeCount, wantedPkmn: Pokemon): {
    twoStat: Pokemon[],
    threeStat: Pokemon[],
    fourStat: Pokemon[],
    fiveStat: Pokemon[],
    sixStat: Pokemon[],
    count: PokeCount
} {
    this.wantedPokemon = wantedPkmn;
    const count = this.wantedPokemonCount();

    // Since the service is a singleton, it needs to be initialized again.
    this.twoStatPokemon = [];
    this.threeStatPokemon = [];
    this.fourStatPokemon = [];
    this.fiveStatPokemon = [];
    this.sixStatPokemon = [];
    this.bothUsed = false;

    switch (count) {
      case 1:
        break;

      case 2:
        const {male, female} = this.choosePokemon(pokeCount);
        this.twoStatPokemon.push(combinePokemon(male, female));
        break;
      case 3:
        this.createThreeStatPokemon(pokeCount);
        break;

      case 4:
        this.createThreeStatPokemon(pokeCount);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[0], true);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[0], this.threeStatPokemon[1]));
        break;

      case 5:
        this.createThreeStatPokemon(pokeCount);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[0], true);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[0], this.threeStatPokemon[1]));
        this.createThreeStatPokemon(pokeCount, this.fourStatPokemon[0]);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[2], true, this.fourStatPokemon[0]);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[3], this.threeStatPokemon[2]));
        this.fiveStatPokemon.push(combinePokemon(this.fourStatPokemon[0], this.fourStatPokemon[1]));
        break;

      case 6:
        this.createThreeStatPokemon(pokeCount);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[0], true);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[0], this.threeStatPokemon[1]));
        this.createThreeStatPokemon(pokeCount, this.fourStatPokemon[0]);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[2], true, this.fourStatPokemon[0]);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[3], this.threeStatPokemon[2]));
        this.fiveStatPokemon.push(combinePokemon(this.fourStatPokemon[0], this.fourStatPokemon[1]));

        this.createThreeStatPokemon(pokeCount, this.fiveStatPokemon[0], true);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[4], true);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[4], this.threeStatPokemon[5]));
        this.createThreeStatPokemon(pokeCount, this.fourStatPokemon[2]);
        this.createThreeStatPokemon(pokeCount, this.threeStatPokemon[6], true, this.fourStatPokemon[2]);
        this.fourStatPokemon.push(combinePokemon(this.threeStatPokemon[6], this.threeStatPokemon[7]));
        this.fiveStatPokemon.push(combinePokemon(this.fourStatPokemon[2], this.fourStatPokemon[3]));

        this.sixStatPokemon.push(combinePokemon(this.fiveStatPokemon[0], this.fiveStatPokemon[1]));

        break;
    }
    return {
      twoStat: this.twoStatPokemon,
      threeStat: this.threeStatPokemon,
      fourStat: this.fourStatPokemon,
      fiveStat: this.fiveStatPokemon,
      sixStat: this.sixStatPokemon,
      count: pokeCount
    };
  }

  /**
   * Function that creates a three stat pokemon. It will return the 3 stat and 2 two stat pokemon over the twoStatPokemon and
   * threeStatPokemon class object.
   *
   * @param pokeCount The amount of currently available breeders
   * @param pokemon The pokemon, from which this is directly dependable from
   * @param bothPools Flag, that allows to take 2 Pokemon from the already set pool
   * @param exception if there is a another four/five stat pokemon that has to be taken into consideration
   */
  private createThreeStatPokemon(pokeCount: PokeCount, pokemon: Pokemon = null, bothPools = false, exception: Pokemon = null): void {
    let male: Pokemon;
    let female: Pokemon;
    const twoStat: Pokemon[] = [];
    const threeStat: Pokemon[] = [];


    // This case is if the three stat to be created is the first pokemon (no dependencies)
    if (pokemon === null) {

      ({male, female} = this.choosePokemon(pokeCount, pokemon, this.invertPkmToPool(pokemon, exception), bothPools));
      twoStat.push(combinePokemon(male, female));

      ({male, female} = this.choosePokemon(pokeCount, twoStat[0], this.invertPkmToPool(twoStat[0])));
      twoStat.push(combinePokemon(male, female));
    // Standard case if there is already at least one higher stat pokemon
    } else {
      this.bothUsed = false;
      ({male, female} = this.choosePokemon(pokeCount, pokemon, this.invertPkmToPool(pokemon, exception), bothPools));
      twoStat.push(combinePokemon(male, female));
      const {pool1, pool2} = this.createPools(pokemon, twoStat[0]);

      ({male, female} = this.choosePokemon(pokeCount, pool1, pool2, bothPools));
      twoStat.push(combinePokemon(male, female));
    }

    threeStat.push(combinePokemon(twoStat[0], twoStat[1]));
    this.twoStatPokemon.push(...twoStat);
    this.threeStatPokemon.push(...threeStat);
  }

  /**
   * This function creates 2 pools for the next choosePokemon call, it also depends on the
   * bothUsed Flag.
   * Main usage is when a new pokemon is dependent on a 3 or 4 stat pokemon from before.
   * It returns 2 pools.
   *
   * @param pool1Old pool that gets a copy of an altered pool, always the bigger pool
   * @param pool2Old smaller pool
   */
  private createPools(pool1Old: Pokemon, pool2Old: Pokemon) {
    let pool1 = Object.assign({}, pool1Old);
    const pool2 = Object.assign({}, pool2Old);
    if (this.bothUsed === true) {
      pool1 = this.invertPkmToPool(pool1);
      for (const key in pool1) {
          if (pool1[key] && pool2[key]) {
            pool1[key] = false;
          }
        }
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
    // Removes unwanted stats
    if (this.wantedPokemon) {
      for (const property in this.wantedPokemon) {
        if (this.wantedPokemon[property] === false) {
          const index = pokeCount.female.findIndex(stat => stat.pokeStat === property);
          if (index > -1) {
            pokeCount.male.splice(index, 1);
            pokeCount.female.splice(index, 1);
          }
        }
      }
    }

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
        // Case when no pokemon is in the already set pool group
        if (!(alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0) &&
          !(alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0)) {

            this.movePools(unsetStatFemale, unsetStatMale, pokeCount);
        // Case when both are in the already set pool group, which is ok
        } else if ((alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0) &&
          (alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0)) {

            // Case if both have the same stat
            if (this.female.pokeStat === this.male.pokeStat) {
              this.chooseNextHighestIfEqual(pokeCount);
              // Check again if both are still in the same pool group
              if ((alreadySetStatFemale.filter((x) => x.pokeStat === this.female.pokeStat).length > 0) &&
                (alreadySetStatMale.filter((x) => x.pokeStat === this.male.pokeStat).length > 0)) {
                  this.bothUsed = true;
                }
            // Case if both are in the same group and don't have the same stat
            } else {
              this.bothUsed = true;
            }
        }
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

    if (this.female.count < 0 || this.male.count < 0) {
      throw Error('no more breeders');
    }
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
    // Todo -> null check
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
  private invertPkmToPool(pkmn: Pokemon, exception: Pokemon = null): Pokemon {
    if (pkmn === null) {
      return null;
    }
    const ret = Object.assign({}, pkmn);
    for (let p in pkmn) {
      if (pkmn.hasOwnProperty(p)) {
        ret[p] = !pkmn[p];
      }
    }
    if (exception) {
      for (let p in ret) {
        if (pkmn.hasOwnProperty(p)) {
          if (!exception[p] && ret[p]) {
            ret[p] = false;
          }
        }
      }
    }
    return ret;
  }

  /**
   * Function, that counts the properties of the wanted Pokemon object.
   * This function is to determinate the case in which the calculate function later goes.
   */
  private wantedPokemonCount() {
    let count = 0;
    for (let p in this.wantedPokemon) {
      if (this.wantedPokemon.hasOwnProperty(p) && this.wantedPokemon[p] === true) {
        count++;
      }
    }
    return count;
  }
}


