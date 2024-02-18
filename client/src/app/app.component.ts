import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NlpService } from '../services/nlp.service';
import { ModalService } from '../services/modal.service';
import { ChunkRoles, IChunk, IWord, PosTags } from '../models/chunk';
import { ChunkFilterModal } from '../components/chunk-filter-modal/chunk-filter-modal.component';
import { ChunkFilterService } from '../services/chunk-filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe, NgFor, NgIf, ChunkFilterModal],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'nlp parser';
  chunks: IChunk[];
  sentence: string;
  isLoading = false;
  toolbox: IWord | null = null;
  posTags = PosTags;

  constructor(
    private nlpService: NlpService,
    public modalService: ModalService,
    public chunkFilterService: ChunkFilterService
  ) {}

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.isLoading = true;
      const file = inputElement.files[0];
      const upload$ = this.nlpService.parseFile(file);
      upload$.subscribe({
        next: (value) => {
          const { originalText, chunks } = value as {
            originalText: string;
            chunks: IChunk[];
          };
          this.sentence = originalText;
          this.chunks = chunks;
        },
        error: (err) => console.error('File parsing error:', err),
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  downloadFile() {
    const jsonContent = JSON.stringify(this.chunks, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chunks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  filterChunks() {
    return this.chunks.filter((chunk) =>
      this.chunkFilterService.roles.find(
        (role) => role.role === chunk.role && role.isSelected
      )
    );
  }

  onInfo() {
    this.modalService.openModal('InfoModal');
  }
}
