import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  get playerName(): string | null {
    return window.localStorage.getItem('playerName');
  }
  set playerName(value: string | null) {
    if (value) {
      window.localStorage.setItem('playerName', value);
    } else {
      window.localStorage.removeItem('playerName');
    }
  }
}
