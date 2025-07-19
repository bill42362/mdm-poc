# API 路由結構說明

這個目錄包含所有的 API 路由定義。

## 檔案結構

```
src/routes/
├── api.js          # 主要 API 路由
├── auth.js         # 認證相關路由 (可選)
├── users.js        # 使用者相關路由 (可選)
└── README.md       # 本說明檔案
```

## 如何新增 Endpoint

### 1. 在現有檔案中新增

在 `src/routes/api.js` 中新增你的 endpoint：

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

### 2. 建立新的路由檔案

如果 endpoint 很多，可以建立獨立的檔案：

```javascript
// src/routes/products.js
const express = require('express');
const { logger } = require('../logger');

const router = express.Router();

router.get('/', (req, res) => {
  // GET /api/products
});

router.post('/', (req, res) => {
  // POST /api/products
});

module.exports = router;
```

然後在 `src/app.js` 中註冊：

```javascript
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);
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
router.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    logger.warn('Invalid data provided');
    return res.status(400).json({
      error: 'Name and email are required'
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

### 使用者端點 (範例)
- `GET /api/users` - 取得所有使用者
- `POST /api/users` - 建立新使用者
- `GET /api/users/:id` - 取得特定使用者

## 測試 Endpoint

```bash
# 測試 GET 端點
curl http://localhost:3000/api/users

# 測試 POST 端點
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# 測試參數端點
curl http://localhost:3000/api/users/1
``` 