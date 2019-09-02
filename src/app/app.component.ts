import { Component } from '@angular/core';
import { AlgorithmService } from './services/algorithm.service';
import { createPokeCount } from './models/poke-count';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Breeding';

  constructor(private algorithm: AlgorithmService) {
    const poke = createPokeCount(1, 2, 3, 4, 9, 1, 0, 1, 0, 2, 9, 4);
    algorithm.calculate(poke);
  }
}
