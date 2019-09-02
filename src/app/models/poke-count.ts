export enum PokeStats {
  cHp = 'HP',
  cAtk = 'Atk',
  cDef = 'Def',
  cSpA = 'SpA',
  cSpD = 'SpD',
  cIni = 'Ini',
}

export interface StatCount {
    pokeStat: PokeStats;
    count: number;
}

export interface PokeCount {
    male: StatCount[];
    female: StatCount[];
}

export function createPokeCount(mHp, mAtk, mDef, mSpa, mSpd, mIni, fHp, fAtk, fDef, fSpa, fSpd, fIni): PokeCount {
    return {
        male: [
            {
                pokeStat: PokeStats.cHp,
                count: mHp
            },
            {
                pokeStat: PokeStats.cAtk,
                count: mAtk
            },
            {
                pokeStat: PokeStats.cDef,
                count: mDef
            },
            {
                pokeStat: PokeStats.cSpA,
                count: mSpa
            },
            {
                pokeStat: PokeStats.cSpD,
                count: mSpd
            },
            {
                pokeStat: PokeStats.cIni,
                count: mIni
            }
        ],
        female: [
            {
                pokeStat: PokeStats.cHp,
                count: fHp
            },
            {
                pokeStat: PokeStats.cAtk,
                count: fAtk
            },
            {
                pokeStat: PokeStats.cDef,
                count: fDef
            },
            {
                pokeStat: PokeStats.cSpA,
                count: fSpa
            },
            {
                pokeStat: PokeStats.cSpD,
                count: fSpd
            },
            {
                pokeStat: PokeStats.cIni,
                count: fIni
            }
        ]
    };
}
