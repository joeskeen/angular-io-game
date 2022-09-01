import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { FieldComponent } from './field/field.component';
import { NewGameDialogComponent } from './new-game-dialog/new-game-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortPipe } from './leaderboard/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    LeaderboardComponent,
    FieldComponent,
    NewGameDialogComponent,
    SortPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
