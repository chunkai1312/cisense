import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule]
})
export class HomePage {
  headline = 'CISense：讓品牌識別更有感';
  subheading = 'AI 驅動的一鍵圖像分析，快速驗證是否符合企業識別規範。';
  features = [
    {
      icon: 'search',
      title: '智慧圖像分析',
      description: '自動分析圖像與企業識別標準的相符程度。'
    },
    {
      icon: 'lightbulb',
      title: 'AI 專業建議',
      description: '提供針對分析結果的具體優化建議，提升設計品質與一致性。'
    },
    {
      icon: 'history',
      title: '分析紀錄管理',
      description: '每次分析都會自動儲存，方便日後比對與追蹤。'
    }
  ];
}
