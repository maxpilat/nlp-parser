import { Injectable } from '@angular/core';

type TState = { status?: number; message: string };

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private state: TState | null = null;

  setTempState(state: TState, duration: number = 3000) {
    this.state = state;
    setTimeout(() => {
      this.state = null;
    }, duration);
  }

  getState() {
    return this.state;
  }
}
