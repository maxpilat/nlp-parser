import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NlpService, NlpSentence, NlpWord } from '../services/nlp.service';
import { ModalService } from '../services/modal.service';
import { Word } from '../models/chunk';
import { ChunkFilterModal } from '../components/chunk-filter-modal/chunk-filter-modal.component';
import { ChunkFilterService } from '../services/chunk-filter.service';
import { InfoModal } from '../components/info-modal/info-modal.component';
import { ErrorService } from '../services/error.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TabService } from '../services/tab.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, ChunkFilterModal, InfoModal],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'nlp parser';
  data: { sentences: NlpSentence[]; words: NlpWord[] } | null = null;
  isLoading = false;
  toolbox: Word | null = null;
  curSentenceIndex: number = 0;
  @ViewChild('dropzone') private _dropzone: ElementRef;

  constructor(
    private nlpService: NlpService,
    public modalService: ModalService,
    public chunkFilterService: ChunkFilterService,
    public errorService: ErrorService,
    public tabService: TabService
  ) {}

  onDropzoneKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._dropzone.nativeElement.click();
    }
  }

  async onFileSelected(event: Event) {
    this.errorService.clearState();
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.isLoading = true;
      const file = inputElement.files[0];

      const upload$ = this.nlpService.parseFile(file);
      upload$
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (value) => {
            console.log(value);
            this.data = value;
          },
          error: (err: HttpErrorResponse) => {
            this.data = null;
            this.errorService.setTempState({
              status: err.status,
              message: err.error.message,
            });
          },
        });
    }
  }

  downloadFile() {
    const jsonContent = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chunks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  filterChunks() {
    return this.data?.sentences[this.curSentenceIndex].chunks.filter((chunk) =>
      this.chunkFilterService
        .getRoles()
        .find((role) => role.role === chunk.role && role.isSelected)
    );
  }
}
