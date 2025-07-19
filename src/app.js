require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { logger, requestLogger } = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中間件
app.use(helmet());

// CORS 設定
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// 解析 JSON 和 URL 編碼的請求體
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP 請求日誌 (使用 morgan)
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
}));

// 自定義請求日誌中間件
app.use(requestLogger);

// 靜態檔案服務
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 健康檢查端點
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MDM 路由
const mdmRoutes = require('./routes/mdm');
app.use('/mdm', mdmRoutes);

// 錯誤處理中間件
app.use((req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  logger.info(`MDM POC Server started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check available at: http://localhost:${PORT}/health`);
});

// 優雅關閉處理
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 