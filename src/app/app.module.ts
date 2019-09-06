import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonStatsComponent } from './components/pokemon-stats/pokemon-stats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatsInputComponent } from './components/stats-input/stats-input.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonStatsComponent,
    StatsInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
