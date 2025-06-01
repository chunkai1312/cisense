use zh-tw

## 專案程式碼庫簡介

CISense 是一個視覺分析平台，利用 AI 技術快速評估企業識別系統 (CIS) 資產 (如 Logo、品牌文件) 是否符合品牌識別指南，並提供分數與優化建議。

此程式碼庫採用 Nx Monorepo 管理，主要包含：
- **apps/api**：基於 NestJS 的後端 API，負責載入資產 (圖片、PDF)、向 OpenAI 與 LangChain 發送分析請求，並將結果儲存至 MongoDB 與 Qdrant 向量資料庫。
- **apps/web**：使用 Angular 與 Angular Material 建置的前端應用，提供使用者介面來上傳或選擇 CIS 資產，並顯示分析結果。
- **cis**：範例 CIS 資料夾，內含示範用 Logo (JPG)、Markdown 與 PDF 檔，可作為本地測試或展示之用。

### 目錄結構

```text
.
├── AGENTS.md            # Agent 設定檔 (使用 zh-tw)
├── apps
│   ├── api              # NestJS 後端專案
│   └── web              # Angular 前端專案
├── cis                  # 範例 CIS 資料 (Logo、文件)
├── docker-compose.yml   # Docker Compose 編排 (包含 MongoDB, Qdrant, cisense)
├── Dockerfile           # 建立 cisense Docker 映像
├── README.md            # 專案說明與快速上手指引
├── package.json         # 根目錄 npm 腳本與依賴
├── nx.json              # Nx Monorepo 設定
└── ...                  # 其他配置 (ESLint, Jest, tsconfig 等)
```

### 技術棧與依賴

- **後端**：Node.js, TypeScript, NestJS, Mongoose (MongoDB), Qdrant, LangChain, OpenAI, pdf-parse, Zod
- **前端**：Angular, Angular Material, RxJS
- **工具與測試**：Nx, ESLint, Jest, Cypress, Docker, docker-compose

### 快速上手

1. 設定環境變數 (`.env`)：
   ```
   CIS_NAME=...
   CIS_IMG_PATH=...
   CIS_DOC_PATH=...
   MONGODB_URI=...
   QDRANT_URL=...
   OPENAI_API_KEY=...
   ```
2. 使用 Docker Compose 啟動所有服務：
   ```bash
   docker-compose up -d
   ```
3. 開啟瀏覽器並前往 `http://localhost:3000`

以上內容提供對此程式碼庫整體架構與運行方式的總覽，可協助新夥伴快速理解並上手開發或部署。