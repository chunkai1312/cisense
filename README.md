# CISense

CISense 是一個基於 Angular 和 NestJS 的企業識別系統 (CIS) 圖像分析平台，利用 AI 技術快速分析圖像是否符合企業識別規範。

## 啟動專案

以下是啟動專案的步驟：

### 1. 安裝依賴

請確保已安裝 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/)。然後執行以下指令安裝專案的依賴：

```sh
npm install
```

或使用 Yarn：

```sh
yarn install
```

### 2. 設定環境變數

根據 `.env.example` 文件建立 `.env` 文件，並填入必要的環境變數，例如：

```env
CIS_NAME=YourCISName
CIS_LOGO_PATH=path/to/logo.png
CIS_FILE_PATH=path/to/cis-document.pdf

MONGODB_URI=mongodb://localhost:27017/cisense
QDRANT_URL=http://localhost:6333

OPENAI_API_KEY=your-openai-api-key
```

### 3. 啟動後端 (API)

後端使用 NestJS 開發，請執行以下指令啟動後端服務：

```sh
npx nx serve api
```

後端服務將預設運行於 `http://localhost:3000`。

### 4. 啟動前端 (Web)

前端使用 Angular 開發，請執行以下指令啟動前端服務：

```sh
npx nx serve web
```

前端服務將預設運行於 `http://localhost:4200`。

### 5. 啟動 MongoDB 和 Qdrant

專案需要 MongoDB 和 Qdrant 作為資料庫與向量儲存，請使用 `docker-compose` 啟動這些服務：

```sh
docker-compose up -d
```

### 6. 開始使用

打開瀏覽器並訪問 `http://localhost:4200`，即可開始使用 CISense 平台。

## 其他指令

### 建立生產環境建置

若需要建立生產環境的建置，請執行以下指令：

```sh
npx nx build web
```

輸出將位於 `dist/apps/web` 資料夾。

### 執行測試

執行前端測試：

```sh
npx nx test web
```

執行後端測試：

```sh
npx nx test api
```

## 技術棧

- **前端**: Angular, Angular Material
- **後端**: NestJS, MongoDB, Qdrant
- **AI**: OpenAI GPT 模型
- **工具**: Nx, Docker

## 貢獻

歡迎提交 Issue 或 Pull Request，讓我們一起改進這個專案！
