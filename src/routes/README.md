# API 路由結構說明

這個目錄包含所有的 API 路由定義。

## 檔案結構

```
src/routes/
├── mdm.js          # MDM Profile 路由
└── README.md       # 本說明檔案
```

## 如何新增 Endpoint

### 1. 在現有檔案中新增

在 `src/routes/mdm.js` 中新增你的 endpoint：

```javascript
// GET /api/your-endpoint
router.get('/your-endpoint', (req, res) => {
  logger.info('Your endpoint accessed');
  res.json({
    message: 'Your response',
    timestamp: new Date().toISOString()
  });
});

// POST /api/your-endpoint
router.post('/your-endpoint', (req, res) => {
  logger.info('POST to your endpoint', { body: req.body });
  res.json({
    message: 'POST received',
    data: req.body
  });
});
```

### 2. 建立新的 MDM Profile 類型

如果需要支援更多 MDM Profile 類型，可以建立獨立的檔案：

```javascript
// src/routes/vpn.js
const express = require('express');
const { logger } = require('../logger');

const router = express.Router();

router.get('/vpn', (req, res) => {
  // GET /mdm/vpn
  logger.info('VPN profile requested');
  // 生成 VPN Profile
});

module.exports = router;
```

然後在 `src/app.js` 中註冊：

```javascript
const vpnProfileRoutes = require('./routes/vpn');
app.use('/mdm', vpnProfileRoutes);
```

## 最佳實踐

### 1. 日誌記錄
```javascript
router.get('/endpoint', (req, res) => {
  logger.info('Endpoint accessed', { 
    method: req.method, 
    url: req.url,
    query: req.query 
  });
  // ... 處理邏輯
});
```

### 2. 錯誤處理
```javascript
router.post('/endpoint', (req, res) => {
  try {
    // 處理邏輯
    res.json({ success: true });
  } catch (error) {
    logger.error('Endpoint error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 3. 資料驗證
```javascript
router.post('/mdm/profile', (req, res) => {
  const { profileName, organization, identifier } = req.body;
  
  if (!profileName || !organization || !identifier) {
    logger.warn('Missing required fields for MDM profile');
    return res.status(400).json({
      error: 'profileName, organization, and identifier are required'
    });
  }
  
  // 處理邏輯
});
```

## 現有的 Endpoint

### 基礎端點
- `GET /health` - 健康檢查
- `GET /api/status` - 伺服器狀態
- `GET /api/test-logs` - 測試日誌

### MDM Profile 端點
- `GET /mdm/webclip` - 生成 iOS Web Clip MDM Profile
- `GET /mdm/webclip/info` - 取得 Web Clip Profile 資訊
- `GET /mdm/vpn` - 生成 iOS VPN MDM Profile
- `GET /mdm/vpn/info` - 取得 VPN Profile 資訊

## 測試 Endpoint

```bash
# 測試 MDM Profile 端點
curl http://localhost:3000/mdm/webclip/info
curl http://localhost:3000/mdm/vpn/info

# 生成 Web Clip Profile
curl "http://localhost:3000/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&organization=My%20Company" -o profile.mobileconfig

# 生成 VPN Profile
curl "http://localhost:3000/mdm/vpn?vpnName=My%20VPN&vpnServer=vpn.mycompany.com&organization=My%20Company" -o vpn.mobileconfig
``` 