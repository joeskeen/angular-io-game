import { Component, Input, OnInit } from '@angular/core';
import { IGameState, IPlayer } from '../../../../models';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  @Input()
  state?: IGameState;

  @Input()
  player?: IPlayer;

  constructor() {}

  ngOnInit(): void {}
}
