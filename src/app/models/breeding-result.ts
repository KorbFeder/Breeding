import { Pokemon } from './pokemon';
import { PokeCount } from './poke-count';


export interface BreedingResult {
    oneStatMale: Pokemon[];
    oneStatFemale: Pokemon[];
    twoStat: Pokemon[];
    threeStat: Pokemon[];
    fourStat: Pokemon[];
    fiveStat: Pokemon[];
    sixStat: Pokemon[];
    count: PokeCount;
}
