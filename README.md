# MDM POC Express Server

這是一個專門用於生成 iOS MDM Profile 的 Node.js Express 伺服器專案，特別專注於 Web Clip 配置檔案的生成和管理。

## 功能特色

- 📱 **iOS MDM Profile 生成** - 專門生成 iOS 裝置管理配置檔案
- 🌐 **Web Clip 支援** - 快速建立主畫面 Web 應用程式捷徑
- 📝 **Winston 日誌系統** - 完整的 MDM Profile 請求記錄
- 🔒 **安全性** - 使用 Helmet 增強安全性
- 🌐 **CORS 支援** - 跨域請求處理
- 🏥 **健康檢查** - 系統狀態監控端點
- ⚡ **開發模式** - 使用 Nodemon 自動重啟
- 🐳 **Docker 支援** - 完整的容器化部署方案

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

## MDM Profile API 端點

### 主要功能
- `GET /mdm/webclip` - 生成 iOS Web Clip MDM Profile
- `GET /mdm/webclip/info` - 取得 Web Clip Profile 資訊
- `GET /mdm/vpn` - 生成 iOS VPN MDM Profile
- `GET /mdm/vpn/info` - 取得 VPN Profile 資訊

### 系統端點
- `GET /health` - 健康檢查
- `GET /api/status` - 伺服器狀態
- `GET /api/test-logs` - 測試日誌功能

## MDM Profile 使用指南

### 快速開始

#### 1. 生成基本 Web Clip Profile
```bash
curl "http://localhost:3001/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com" -o myapp.mobileconfig
```

#### 2. 生成完整配置的 Profile
```bash
curl "http://localhost:3001/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&organization=My%20Company&description=Quick%20access%20to%20my%20web%20app" -o myapp.mobileconfig
```

#### 3. 生成 VPN Profile
```bash
curl "http://localhost:3001/mdm/vpn?vpnName=My%20VPN&vpnServer=vpn.mycompany.com&organization=My%20Company" -o vpn.mobileconfig
```

#### 4. 查看可用的參數
```bash
curl http://localhost:3001/mdm/webclip/info
curl http://localhost:3001/mdm/vpn/info
```

### 參數說明

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `webClipName` | string | 是 | Web Clip 在主畫面上顯示的名稱 |
| `webClipURL` | string | 是 | 要開啟的網頁 URL |
| `organization` | string | 否 | 組織名稱 |
| `profileName` | string | 否 | Profile 顯示名稱 |
| `description` | string | 否 | Profile 描述 |
| `identifier` | string | 否 | Profile 識別碼 |
| `webClipIcon` | string | 否 | 圖示 URL |

### 安裝到 iOS 裝置

1. **傳送 Profile 檔案**：將生成的 `.mobileconfig` 檔案傳送到 iOS 裝置
2. **點擊安裝**：在 iOS 裝置上點擊檔案開始安裝
3. **確認安裝**：在設定 > 一般 > VPN與裝置管理 中確認安裝
4. **使用 Web Clip**：在主畫面上會出現新的圖示，點擊即可開啟網頁

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
│   ├── logger.js       # 日誌模組
│   └── routes/
│       ├── mdm.js      # MDM Profile 路由
│       └── README.md   # 路由說明文件
├── deployment/         # 部署配置檔案
│   ├── docker-compose.prod.yml
│   ├── digitalocean-app.yaml
│   ├── nginx.conf
│   └── k8s/           # Kubernetes 配置
├── logs/              # 日誌檔案目錄
├── package.json       # 專案配置
├── env.example        # 環境變數範例
├── Dockerfile         # Docker 映像配置
└── README.md         # 專案說明
```

## 開發

### 新增 MDM Profile 類型
在 `src/routes/mdm.js` 中新增你的 MDM Profile 類型：

```javascript
// 新增 VPN Profile
router.get('/mdm/vpn-profile', (req, res) => {
  logger.info('VPN profile requested');
  // 生成 VPN Profile XML
  const vpnProfile = generateVPNProfile(req.query);
  res.set({
    'Content-Type': 'application/x-apple-aspen-config',
    'Content-Disposition': 'attachment; filename="vpn.mobileconfig"'
  });
  res.send(vpnProfile);
});
```

### 使用日誌
```javascript
const { logger } = require('./logger');

logger.info('MDM profile generated', { 
  profileType: 'webclip',
  userAgent: req.get('User-Agent'),
  ip: req.ip 
});
```

## 部署

### 本地測試

```bash
# 啟動開發伺服器
npm run dev

# 測試 MDM Profile 生成
curl "http://localhost:3001/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com" -o test.mobileconfig
```

### 使用 ngrok 進行公網測試

```bash
# 安裝 ngrok (如果還沒安裝)
# macOS: brew install ngrok
# 或從 https://ngrok.com/download 下載

# 基本 ngrok 隧道 (HTTP)
npm run ngrok

# HTTPS 隧道
npm run ngrok:https

# 自定義子域名隧道 (需要 ngrok 付費帳號)
npm run ngrok:subdomain

# 同時啟動開發伺服器和 ngrok 隧道
npm run tunnel

# 同時啟動開發伺服器和 HTTPS 隧道
npm run tunnel:https

# 清理所有進程 (停止開發伺服器和 ngrok)
npm run cleanup
```

#### ngrok 使用範例

啟動 ngrok 後，你會得到一個公網 URL，例如：`https://abc123.ngrok.io`

```bash
# 使用公網 URL 測試 MDM Profile
curl "https://abc123.ngrok.io/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com" -o myapp.mobileconfig

# 在 iOS 裝置上直接訪問
# 在 Safari 中打開：https://abc123.ngrok.io/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com

#### 使用配置檔案 (推薦)

1. **設定 ngrok 配置檔案**：
   ```bash
   cp ngrok.yml.example ngrok.yml
   # 編輯 ngrok.yml，填入你的 auth token
   ```

2. **使用配置檔案啟動**：
   ```bash
   npm run ngrok:config
   # 或同時啟動開發伺服器和 ngrok
   npm run tunnel:config
   ```

詳細設定說明請參考 `docs/ngrok-setup.md`

### Docker 部署

```bash
# 建立 Docker 映像
docker build -t mdm-poc .

# 使用 Docker Compose 運行
docker-compose up -d

# 測試 MDM Profile 生成
curl "http://localhost:3001/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com" -o test.mobileconfig
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

### 生產環境使用

部署完成後，你可以透過以下方式生成 MDM Profile：

```bash
# 基本 Web Clip Profile
curl "https://your-domain.com/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com" -o myapp.mobileconfig

# 完整配置 Profile
curl "https://your-domain.com/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&organization=My%20Company&description=Quick%20access%20to%20my%20web%20app" -o myapp.mobileconfig
```

詳細部署說明請參考 `deployment/README.md`

## 常見問題

### Q: 什麼是 Web Clip？
A: Web Clip 是 iOS 的一項功能，可以將網頁應用程式以圖示形式安裝到主畫面上，讓使用者可以像使用原生 App 一樣快速存取網頁服務。

### Q: 生成的 Profile 檔案可以安裝到哪些裝置？
A: 生成的 `.mobileconfig` 檔案可以安裝到所有支援 iOS 的裝置，包括 iPhone、iPad 和 iPod touch。

### Q: 如何移除已安裝的 Profile？
A: 在 iOS 裝置上，前往 設定 > 一般 > VPN與裝置管理，找到已安裝的 Profile 並點擊「移除描述檔」。

### Q: 可以自訂 Web Clip 的圖示嗎？
A: 目前版本使用預設圖示，未來版本將支援自訂圖示功能。

## 授權

MIT License 