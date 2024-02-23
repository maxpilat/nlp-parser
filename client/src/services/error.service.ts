import { Injectable } from '@angular/core';

type IState = { status?: number; message: string };

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private state: IState | null = null;

  setTempState(state: IState, duration: number = 3000) {
    this.state = state;
    setTimeout(() => {
      this.state = null;
    }, duration);
  }

  getState() {
    return this.state;
  }
}
