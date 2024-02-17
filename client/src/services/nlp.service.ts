import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChunk } from '../models/chunk';

@Injectable({ providedIn: 'root' })
export class NlpService {
  constructor(private http: HttpClient) {}

  parseFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://127.0.0.1:5000', formData) as Observable<{
      originalText: string;
      chunks: IChunk[];
    }>;
  }
}
