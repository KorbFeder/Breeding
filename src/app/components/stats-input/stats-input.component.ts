import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PokeCount, createPokeCount } from 'src/app/models/poke-count';

@Component({
  selector: 'app-stats-input',
  templateUrl: './stats-input.component.html',
  styleUrls: ['./stats-input.component.scss']
})
export class StatsInputComponent implements OnInit {
  statsForm: FormGroup;
  pokeCount: PokeCount = createPokeCount(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  constructor(private fb: FormBuilder) {
    this.statsForm = new FormGroup({});
    for (let poke of this.pokeCount.female) {
      this.statsForm.registerControl('female' + poke.pokeStat, new FormControl(poke.count));
    }
    for (let poke of this.pokeCount.male) {
      this.statsForm.registerControl('male' + poke.pokeStat, new FormControl(poke.count));
    }
  }

  ngOnInit() {
  }

  public saveStats(value) {
    console.log(value);
  }

  public isValidInput(id: string) {
    const inputForm = this.statsForm.controls[id];
    if (inputForm.errors && (inputForm.dirty || inputForm.touched)) {
      return false;
    }
    return true;
  }
}
