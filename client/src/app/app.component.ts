import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NlpService } from '../services/nlp.service';
import { ChunkRoles, IChunk, IWord, PosTags } from '../models/chunk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe, NgFor, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'nlp parser';
  chunks: IChunk[] = [];
  sentence: string;
  isLoading = false;
  tooltip: IWord | null = null;
  posTags = PosTags;
  chunkRoles = ChunkRoles;

  constructor(private nlpService: NlpService) {}

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

  concatenateWords(words: IWord[]) {
    return words.map((word) => word.origin).join(' ');
  }

  showTooltip(word: IWord) {
    this.tooltip = word;
  }

  hideTooltip() {
    this.tooltip = null;
  }
}
