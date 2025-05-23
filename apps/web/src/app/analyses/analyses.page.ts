import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { AnalysesService } from './analyses.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-analyses',
  templateUrl: './analyses.page.html',
  styleUrls: ['./analyses.page.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
})
export class AnalysesPage implements OnInit {
  analyses: any[] = [];
  loading = false;

  constructor(
    private analysesService: AnalysesService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.analysesService.getAll().subscribe({
      next: (res: any) => {
        this.analyses = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteAnalysis(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.analysesService.delete(id).subscribe({
          next: () => {
            this.analyses = this.analyses.filter(a => a._id !== id);
          },
          error: () => {
            alert('刪除失敗');
          }
        });
      }
    });
  }

}
