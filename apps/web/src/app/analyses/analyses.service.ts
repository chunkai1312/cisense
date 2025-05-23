import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Analysis } from './analysis.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysesService {
  private readonly baseUrl = 'http://localhost:3000/api/analyses';

  constructor(private http: HttpClient) {}

  analyze(file: File): Observable<Analysis> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Analysis>(this.baseUrl, formData);
  }

  getAll(): Observable<{ results: Analysis[] }> {
    return this.http.get<{ results: Analysis[] }>(this.baseUrl);
  }

  getById(id: string): Observable<Analysis> {
    return this.http.get<Analysis>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
