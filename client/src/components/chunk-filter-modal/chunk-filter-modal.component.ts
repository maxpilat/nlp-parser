import { Component, EventEmitter, Output } from '@angular/core';
import { ChunkRoles } from '../../models/chunk';
import { NgFor, TitleCasePipe } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { ChunkFilterService } from '../../services/chunk-filter.service';

@Component({
  selector: 'app-chunk-filter-modal',
  standalone: true,
  imports: [NgFor, TitleCasePipe],
  templateUrl: './chunk-filter-modal.component.html',
})
export class ChunkFilterModal {
  constructor(
    public modalService: ModalService,
    public chunkFilterService: ChunkFilterService
  ) {}

  apply() {
    this.chunkFilterService.roles.forEach((role) => {
      role.isSelected = (
        document.getElementById(role.role) as HTMLInputElement
      ).checked;
    });
  }
}
