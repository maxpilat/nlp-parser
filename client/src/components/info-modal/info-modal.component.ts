import { KeyValuePipe, NgFor, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ChunkRoles, PosTags } from '../../models/chunk';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [NgFor, TitleCasePipe, KeyValuePipe],
  templateUrl: './info-modal.component.html',
})
export class InfoModal {
  roles = ChunkRoles;
  tags = PosTags;
  constructor(public modalService: ModalService) {}
}
