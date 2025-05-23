import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-delete-confirm-dialog',
  template: `
    <h2 mat-dialog-title>確認刪除</h2>
    <mat-dialog-content>您確定要刪除這筆分析紀錄嗎？此操作無法復原。</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>取消</button>
      <button mat-button color="warn" [mat-dialog-close]="true">刪除</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmDialogComponent {}
