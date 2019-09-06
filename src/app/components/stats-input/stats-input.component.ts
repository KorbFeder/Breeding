import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PokeCount, createPokeCount } from 'src/app/models/poke-count';
import { createPokemon } from 'src/app/models/pokemon';

@Component({
  selector: 'app-stats-input',
  templateUrl: './stats-input.component.html',
  styleUrls: ['./stats-input.component.scss']
})
export class StatsInputComponent implements OnInit {
  @Output()
  public calculate = new EventEmitter();

  statsForm: FormGroup;
  pokeCount: PokeCount = createPokeCount(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  constructor() {
    this.statsForm = new FormGroup({
      HPcb: new FormControl(false),
      Atkcb: new FormControl(false),
      Defcb: new FormControl(false),
      SpAcb: new FormControl(false),
      SpDcb: new FormControl(false),
      Inicb: new FormControl(false)
    });
    for (let poke of this.pokeCount.female) {
      this.statsForm.registerControl('female' + poke.pokeStat, new FormControl(poke.count));
    }
    for (let poke of this.pokeCount.male) {
      this.statsForm.registerControl('male' + poke.pokeStat, new FormControl(poke.count));
    }
  }

  ngOnInit() {
  }

  public saveStats(value: {
    femaleHP: number, femaleAtk: number, femaleDef: number, femaleSpA: number, femaleSpD: number, femaleIni: number,
    maleHP: number, maleAtk: number, maleDef: number, maleSpA: number, maleSpD: number, maleIni: number,
    HPcb: boolean, Atkcb: boolean, Defcb: boolean, SpAcb: boolean, SpDcb: boolean, Inicb: boolean
  }): void {
    this.calculate.emit({
      pokeCount: createPokeCount(value.maleHP, value.maleAtk, value.maleDef, value.maleSpA, value.maleSpD,
                 value.maleIni, value.femaleHP, value.femaleAtk, value.femaleDef, value.femaleSpA, value.femaleSpD, value.femaleIni),
      pokemon: {
        HP: value.HPcb,
        Atk: value.Atkcb,
        Def: value.Defcb,
        SpA: value.SpAcb,
        SpD: value.SpDcb,
        Ini: value.Inicb
      }
    });
  }

  public isValidInput(id: string): boolean {
    const inputForm = this.statsForm.controls[id];
    if (inputForm.errors && (inputForm.dirty || inputForm.touched)) {
      return false;
    }
    return true;
  }
}
