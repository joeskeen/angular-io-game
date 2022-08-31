import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../state/state.service';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.scss'],
})
export class NewGameDialogComponent implements OnInit {
  readonly nameControl = new FormControl('', [Validators.required]);

  constructor(private stateService: StateService, private router: Router) {}

  ngOnInit(): void {
    this.nameControl.patchValue(this.stateService.playerName);
  }

  joinGame() {
    if (this.nameControl.invalid) {
      return;
    }

    this.stateService.playerName = this.nameControl.value;

    this.router.navigate(['/game']);
  }
}
