# MDM POC Express Server

這是一個具有強大日誌功能的 Node.js Express 伺服器專案。

## 功能特色

- 🚀 **Express.js** - 快速、靈活的 Node.js Web 框架
- 📝 **Winston 日誌系統** - 多級別日誌記錄，支援檔案和控制台輸出
- 🔒 **安全性** - 使用 Helmet 增強安全性
- 🌐 **CORS 支援** - 跨域請求處理
- 📊 **HTTP 請求日誌** - 詳細的請求記錄
- 🏥 **健康檢查** - 系統狀態監控端點
- ⚡ **開發模式** - 使用 Nodemon 自動重啟

## 安裝與設定

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **環境變數設定**
   ```bash
   cp env.example .env
   ```
   然後編輯 `.env` 檔案設定你的環境變數

3. **啟動伺服器**
   ```bash
   # 開發模式 (自動重啟)
   npm run dev
   
   # 生產模式
   npm start
   ```

## API 端點

- `GET /health` - 健康檢查
- `GET /api/status` - 伺服器狀態
- `GET /api/test-logs` - 測試日誌功能

## 日誌系統

### 日誌級別
- `error` - 錯誤訊息
- `warn` - 警告訊息  
- `info` - 一般資訊
- `debug` - 除錯訊息

### 日誌檔案
- `logs/error.log` - 錯誤日誌
- `logs/combined.log` - 所有日誌

### 環境變數
- `LOG_LEVEL` - 設定日誌級別 (預設: info)
- `NODE_ENV` - 環境模式 (development/production)

## 專案結構

```
mdm-poc/
├── src/
│   ├── app.js          # 主應用程式
│   └── logger.js       # 日誌模組
├── logs/               # 日誌檔案目錄
├── package.json        # 專案配置
├── env.example         # 環境變數範例
└── README.md          # 專案說明
```

## 開發

### 新增路由
在 `src/app.js` 中新增你的路由：

```javascript
app.get('/api/your-endpoint', (req, res) => {
  logger.info('Your endpoint accessed');
  res.json({ message: 'Your response' });
});
```

### 使用日誌
```javascript
const { logger } = require('./logger');

logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { additional: 'data' });
```

## 部署

### 本地 Docker 測試

```bash
# 建立 Docker 映像
docker build -t mdm-poc .

# 使用 Docker Compose 運行
docker-compose up -d

# 測試應用程式
curl http://localhost:3000/health
```

### Digital Ocean 部署

#### 方法 1: App Platform (推薦)
```bash
# 使用 Digital Ocean App Platform
doctl apps create --spec deployment/digitalocean-app.yaml
```

#### 方法 2: Container Registry + Droplet
```bash
# 1. 建立 Container Registry
doctl registry create your-registry-name

# 2. 認證 Docker
doctl registry login

# 3. 建立和推送映像
./scripts/build-and-push.sh registry.digitalocean.com your-registry/mdm-poc latest

# 4. 在 Droplet 上部署
docker-compose -f deployment/docker-compose.prod.yml up -d
```

詳細部署說明請參考 `deployment/README.md`

## 授權

MIT License 