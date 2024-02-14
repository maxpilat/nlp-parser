import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NlpService } from '../services/nlp.service';
import { IChunk } from '../models/chunk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'nlp parser';
  chunks: IChunk[] = [];

  constructor(private nlpService: NlpService) {}

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const upload$ = this.nlpService.parseFile(file);
      upload$.subscribe({
        next: (value) => {
          this.chunks = value as IChunk[];
          console.log(this.chunks);
        },
        error: (err) => console.error('File parsing error:', err),
      });
    }
  }
}
