import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private state: string | null = null;

  openModal(modal: string) {
    this.state = modal;
    document.body.classList.add('overflow-hidden');
  }

  closeModal() {
    this.state = null;
    document.body.classList.remove('overflow-hidden');
  }

  isOpen(modalName: string) {
    return this.state === modalName;
  }
}
