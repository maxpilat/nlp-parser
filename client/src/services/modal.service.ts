import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  state: string | null = null;

  openModal(modal: string) {
    this.state = modal;
  }

  closeModal() {
    this.state = null;
  }
}
