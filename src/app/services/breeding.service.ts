import { Injectable } from '@angular/core';
import { PokeCount, StatCount } from '../models/poke-count';
import { Pokemon, createPokemon, combinePokemon } from '../models/pokemon';
import { BreedingResult } from '../models/breeding-result';

/**
 * Breeding service, calculates the breeding of a pokemon, by trying to use the given breeders and a Pokemon
 * with stats, which the result should have.
 */
@Injectable({
  providedIn: 'root'
})
export class BreedingService {
  private breedRes: BreedingResult;
  private pokeCount: PokeCount;
  constructor() { }

  /**
   * This function takes in the breeders and the pokemon which should be the result. It tries to breed the result
   * pokemon and gives back the step by step pokemon which are needed for breeding.
   * Returns a BreedingResult object, which holds all the oneStat, twoStat up to sixStat pokemon that were
   * bred and used for the next breeds.
   *
   * @param pokeCount The current count of breeders available
   * @param wantedPokemon The pokemon which should be the end result
   */
  public calculate(pokeCount: PokeCount, wantedPokemon: Pokemon): BreedingResult {
    this.pokeCount = Object.assign({}, pokeCount);
    const wantedPokemonStatsSet = this.wantedPokemonCount(wantedPokemon);
    this.eliminateUnwantedStats(wantedPokemon);

    // Initialize the BreedingResult object here, since the service is a singleton (old data might be stored else).
    this.breedRes = {
      oneStatFemale: [],
      oneStatMale: [],
      twoStat: [],
      threeStat: [],
      fourStat: [],
      fiveStat: [],
      sixStat: [],
      count: this.pokeCount
    };

    try{
      // Depending on how much stats the user sent, the corresponding pokemon is getting bred.
      switch (wantedPokemonStatsSet) {
        case 0:
          break;
        case 1:
          // TODO -> 1 send back oneStat
          break;
        case 2:
          this.breedRes.twoStat.push(this.choosePokemon());
          break;
        case 3:
          this.createThreeStat();
          break;
        case 4:
          this.createFourStatPokemon();
          break;
        case 5:
          this.createFiveStatPokemon();
          break;
        case 6:
          this.createSixStatPokemon();
          break;
      }
    } catch (e) {
      if (e.message === 'zero breeders') {
        return this.breedRes;
      }
    }

    return this.breedRes;
  }

  /**
   * This function creates a Pokemon with 3 stats.
   * It will also create 2 Pokemon with 2 stats, as well as 4 Pokemon with one stat.
   * The pokemon will be pushed into the breedRes object.
   *
   * @param predecessor the Pokemon which was directly created beforehand.
   */
  private createThreeStat(predecessor: Pokemon = null): void {
    let restrictions = null;
    if (predecessor) {
      restrictions = this.createRestrictions(predecessor);
    }
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));
    restrictions = this.createRestrictions(this.breedRes.twoStat[this.breedRes.twoStat.length - 1], predecessor);
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));

    this.breedRes.threeStat.push(
      combinePokemon(this.breedRes.twoStat[this.breedRes.twoStat.length - 1], this.breedRes.twoStat[this.breedRes.twoStat.length - 2]));
  }

  /**
   * This function creates a 4 stat pokemon.
   */
  private createFourStatPokemon(): void {
    this.createThreeStat();
    this.createThreeStat(this.breedRes.threeStat[this.breedRes.threeStat.length - 1]);

    this.breedRes.fourStat.push(
      combinePokemon(this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
        this.breedRes.threeStat[this.breedRes.threeStat.length - 2]));
  }

  /**
   * This function creates a 5 stat pokemon.
   * TODO -> minimize the function.
   */
  private createFiveStatPokemon(): void {
    this.createFourStatPokemon();
    this.createThreeStat(this.breedRes.fourStat[this.breedRes.fourStat.length - 1]);

    let restrictions = this.createRestrictions(
      this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
      this.breedRes.fourStat[this.breedRes.fourStat.length - 1]
    );
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));

    restrictions = this.createRestrictions(
      this.breedRes.twoStat[this.breedRes.twoStat.length - 1],
      this.breedRes.threeStat[this.breedRes.threeStat.length - 1]
    );
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));

    this.breedRes.threeStat.push(
      combinePokemon(this.breedRes.twoStat[this.breedRes.twoStat.length - 1], this.breedRes.twoStat[this.breedRes.twoStat.length - 2]));

    this.breedRes.fourStat.push(
      combinePokemon(
        this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
        this.breedRes.threeStat[this.breedRes.threeStat.length - 2]
      )
    );

    this.breedRes.fiveStat.push(
      combinePokemon(this.breedRes.fourStat[this.breedRes.fourStat.length - 1], this.breedRes.fourStat[this.breedRes.fourStat.length - 2]));
  }

  /**
   * This function creates a six stat pokemon.
   * TODO -> minimize the function
   */
  private createSixStatPokemon(): void {
    this.createFiveStatPokemon();

    this.createThreeStat(this.breedRes.fiveStat[this.breedRes.fiveStat.length - 1]);
    this.createThreeStat(this.breedRes.threeStat[this.breedRes.threeStat.length - 1]);

    this.breedRes.fourStat.push(
      combinePokemon(this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
        this.breedRes.threeStat[this.breedRes.threeStat.length - 2]));

    this.createThreeStat(this.breedRes.fourStat[this.breedRes.fourStat.length - 1]);

    let restrictions = this.createRestrictions(
      this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
      this.breedRes.fourStat[this.breedRes.fourStat.length - 1]
    );
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));

    restrictions = this.createRestrictions(
      this.breedRes.twoStat[this.breedRes.twoStat.length - 1],
      this.breedRes.threeStat[this.breedRes.threeStat.length - 1]
    );
    this.breedRes.twoStat.push(this.choosePokemon(restrictions));

    this.breedRes.threeStat.push(
      combinePokemon(this.breedRes.twoStat[this.breedRes.twoStat.length - 1], this.breedRes.twoStat[this.breedRes.twoStat.length - 2]));

    this.breedRes.fourStat.push(
      combinePokemon(
        this.breedRes.threeStat[this.breedRes.threeStat.length - 1],
        this.breedRes.threeStat[this.breedRes.threeStat.length - 2]
      )
    );

    this.breedRes.fiveStat.push(
      combinePokemon(this.breedRes.fourStat[this.breedRes.fourStat.length - 1], this.breedRes.fourStat[this.breedRes.fourStat.length - 2]));

    this.breedRes.sixStat.push(combinePokemon(this.breedRes.fiveStat[0], this.breedRes.fiveStat[1]));
  }

  /**
   * This function creates restrictions under which conditions the pokemon can choose its stats.
   * Example:
   * predecessor:
   * HP: true
   * Atk: true
   * Def: false
   * SpA: false
   * SpD: false
   * Ini: false
   * 
   * Since the merge should still be doable, there will be a restriction object which has alreadySetStat, which would be
   * HP and Atk and a notYetSetStat that would be the rest.
   * If a highStatPokemon is given, than notYetSet will have to take this one into consideration.
   *
   * @param predecessor The Pokemon which came directly before
   * @param highStatPokemon A Pokemon that will be merged in in the future and is relevant for this one
   */
  private createRestrictions(predecessor: Pokemon, highStatPokemon: Pokemon = null): {alreadySetStat: Pokemon, notYetSetStat: Pokemon} {
    const alreadySetStat = Object.assign({}, predecessor);
    let notYetSetStat;
    // If there is no highStatPokemon given
    if (highStatPokemon === null) {
      notYetSetStat = this.invertPkmToPool(predecessor);
    } else {
      notYetSetStat = Object.assign({}, highStatPokemon);
      for (const property in highStatPokemon) {
        if (notYetSetStat[property] && predecessor[property]) {
          notYetSetStat[property] = false;
        }
      }
    }
    return {alreadySetStat, notYetSetStat};
  }

  /**
   * This function chooses 2 Pokemon and merges them into a two Stat pokemon, which gets than returned.
   * It will also push the oneStat pokemon into the breedRes object, to know the gender of the used pokemon.
   * The restriction object restricts the stat which can be picked for a pokemon. For Example:
   *
   * alreadySetStat: HP, Atk
   * notSetYetStat: Def, SpA, SpD, Ini
   *
   * Than one of the two pokemon can only be from alreadySetStat and the other one from notYetSetStat.
   *
   * If the count of pokemon would fall below 0, than an error will be thrown, that there are no more breeders available.
   *
   * @param restr the restriction object, which helps, the function know which pokemon must be chosen
   */
  private choosePokemon(restr: {alreadySetStat: Pokemon, notYetSetStat: Pokemon } = null): Pokemon {
    // Sort the breeders, to pick the ones that have the most pokemon of one stat
    this.pokeCount.female.sort(this.comparator);
    this.pokeCount.male.sort(this.comparator);

    let male = [...this.pokeCount.male][0];
    let female = [...this.pokeCount.female][0];

    // If there were pokemon input that restrict the choosing of the pokemon
    if (restr) {

      // Filters all stats that are not set in either alreadySetStat and notYetStat
      const onlyAvailableMale = [...this.pokeCount.male].filter(
        (stat) => restr.alreadySetStat[stat.pokeStat] || restr.notYetSetStat[stat.pokeStat]);
      const onlyAvailableFemale = [...this.pokeCount.female].filter(
        (stat) => restr.alreadySetStat[stat.pokeStat] || restr.notYetSetStat[stat.pokeStat]);

      male = onlyAvailableMale[0];
      female = onlyAvailableFemale[0];

      // If both would have the 'already set stat'
      if (restr.alreadySetStat[male.pokeStat] && restr.alreadySetStat[female.pokeStat]) {
        ({male, female} = this.changeStats(restr.alreadySetStat, restr.notYetSetStat, male, female));
      // If both would have the 'not yet set stat'
      } else if (restr.notYetSetStat[male.pokeStat] && restr.notYetSetStat[female.pokeStat]) {
        ({male, female} = this.changeStats(restr.notYetSetStat, restr.alreadySetStat, male, female));
      }
    } else {
      // If both chosen pokemon share the same stat
      if (male.pokeStat === female.pokeStat) {
        const malePkmn = createPokemon(male.pokeStat);
        ({male, female} = this.changeStats(malePkmn , this.invertPkmToPool(malePkmn), male, female));
      }
    }

    // Decrement the breeder count
    this.pokeCount.male.forEach(stat => {
      if (stat.pokeStat === male.pokeStat) {
        stat.count--;
        male.count--;
      }
    });
    this.pokeCount.female.forEach(stat => {
      if (stat.pokeStat === female.pokeStat) {
        stat.count--;
        female.count--;
      }
    });
    // If the breeder count would fall below 0 than the breed will be unsuccessful.
    if (male.count < 0 || female.count < 0) {
      throw Error('zero breeders');
    }

    const femalePokemon = createPokemon(female.pokeStat);
    const malePokemon = createPokemon(male.pokeStat);

    // Push the created pokemon into the breedRes object to keep track of the gender
    this.breedRes.oneStatFemale.push(femalePokemon);
    this.breedRes.oneStatMale.push(malePokemon);

    return combinePokemon(malePokemon, femalePokemon);
  }

  /**
   * This function changes the stats of pokemon, to their right group.
   * For example:
   * the most males would be HP, and the most female would be Atk
   *
   * restrictions:
   * alreadySet: HP, Atk
   * NotYetSet: DEF, Ini, SpA, SpD
   *
   * Both pokemon would be in the same group so one has be moved to the other, this function decides this.
   *
   * @param fromStat The stat-group which both pokemon are part of
   * @param toStat The stat-group one has to be moved to
   * @param male The male pokemon that was chosen beforehand
   * @param female The female pokemon that was chosen beforehand
   */
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

  /**
   * Function, that counts the properties of the wanted Pokemon object.
   * This function is to determinate the case in which the calculate function later goes.
   */
  private wantedPokemonCount(wantedPokemon: Pokemon): number {
    let count = 0;
    for (let p in wantedPokemon) {
      if (wantedPokemon.hasOwnProperty(p) && wantedPokemon[p] === true) {
        count++;
      }
    }
    return count;
  }

  /**
   * Eliminates the stats, that aren't relevant for the breed.
   * For Example:
   * wantedPokemon:
   * HP: true
   * Atk: true
   * Def: true
   * SpD: true
   * SpA: false
   * Ini: false
   * 
   * than the SpA and Ini get removed from the count object for this breed.
   * 
   * @param wantedPokemon The wanted pokemon form the user
   */
  private eliminateUnwantedStats(wantedPokemon: Pokemon): void {
    for (const property in wantedPokemon) {
      if (wantedPokemon[property] === false) {
        const index = this.pokeCount.female.findIndex(stat => stat.pokeStat === property);
        if (index > -1) {
          this.pokeCount.male.splice(index, 1);
          this.pokeCount.female.splice(index, 1);
        }
      }
    }
  }


}


