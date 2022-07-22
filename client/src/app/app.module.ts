import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { FieldComponent } from './field/field.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    LeaderboardComponent,
    FieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
