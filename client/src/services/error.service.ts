import { Injectable } from '@angular/core';

type IState = { message: string; status?: number };

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

  clearState() {
    this.state = null;
  }
}
