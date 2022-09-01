import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReloadService {
  reloadPage() {
    window.location.reload();
  }
}
