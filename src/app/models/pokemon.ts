import { PokeStats } from './poke-count';

export interface Pokemon {
    HP: boolean;
    Atk: boolean;
    Def: boolean;
    SpA: boolean;
    SpD: boolean;
    Ini: boolean;
}

export function createPokemon(stat: PokeStats): Pokemon {
    return {
       HP: stat === PokeStats.cHp,
       Atk: stat === PokeStats.cAtk,
       Def: stat === PokeStats.cDef,
       SpA: stat === PokeStats.cSpA,
       SpD: stat === PokeStats.cSpD,
       Ini: stat === PokeStats.cIni,
    };
}

export function combinePokemon(pokemonOne: Pokemon, pokemonTwo: Pokemon): Pokemon {
    return {
        HP: pokemonOne.HP || pokemonTwo.HP,
        Atk: pokemonOne.Atk || pokemonTwo.Atk,
        Def: pokemonOne.Def || pokemonTwo.Def,
        SpA: pokemonOne.SpA || pokemonTwo.SpA,
        SpD: pokemonOne.SpD || pokemonTwo.SpD,
        Ini: pokemonOne.Ini || pokemonTwo.Ini,
    };
};