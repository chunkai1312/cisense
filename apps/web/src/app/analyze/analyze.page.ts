import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnalysesService } from '../analyses/analyses.service';

@Component({
  standalone: true,
  selector: 'app-analyze',
  templateUrl: './analyze.page.html',
  styleUrls: ['./analyze.page.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class AnalyzePage {
  file: File | null = null;
  previewUrl: string | null = null;
  result: any = null;
  loading = false;
  dragging = false;

  constructor(
    private analysesService: AnalysesService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.setFile(input.files?.[0] ?? null);
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer?.files?.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave() {
    this.dragging = false;
  }

  setFile(file: File | null) {
    this.file = file;
    this.result = null;
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  analyze() {
    if (!this.file) {
      this.snackBar.open('請先選擇圖片檔案', '關閉', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.loading = true;
    this.result = null;

    this.analysesService.analyze(this.file).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('分析失敗，請稍後再試', '關閉', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
