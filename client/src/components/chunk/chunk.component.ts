import { Component, Input } from '@angular/core';
import { IChunk } from '../../models/chunk';

@Component({
  selector: 'app-chunk-tr',
  standalone: true,
  templateUrl: './chunk.component.html',
})
export class Chunk {
  @Input() chunk: IChunk;
}
