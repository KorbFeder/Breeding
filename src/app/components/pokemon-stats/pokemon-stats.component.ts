import { Component, OnInit, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';

@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.scss']
})
export class PokemonStatsComponent implements OnInit {
  @Input()
  pokemon: Pokemon;

  constructor() { }

  ngOnInit() {
  }

  public isMarked(stat: boolean) {
    if (stat) {
      return 'x';
    } else {
      return ' ';
    }
  }
}
