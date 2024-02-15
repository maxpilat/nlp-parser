import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NlpService } from '../services/nlp.service';
import { IChunk, IWord } from '../models/chunk';
import { Chunk } from '../components/chunk/chunk.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe, Chunk, NgFor, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'nlp parser';
  chunks: IChunk[] = [];
  sentence: string;
  isLoading = false;
  tooltip: IWord | null = null;

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

          console.log(value);
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
