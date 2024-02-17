import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  state = new Map<string, boolean>();

  openModal(modal: string) {
    this.closeModal();
    this.state.set(modal, true);
  }

  closeModal() {
    for (let [key, value] of this.state) {
      if (value) {
        this.state.set(key, false);
        break;
      }
    }
  }
}
