require('dotenv').config();
const express = require('express');
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

// API 路由
app.get('/api/status', (req, res) => {
  logger.info('API status endpoint accessed');
  res.json({
    message: 'MDM POC Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 測試日誌端點
app.get('/api/test-logs', (req, res) => {
  logger.info('This is an info log message');
  logger.warn('This is a warning log message');
  logger.error('This is an error log message');
  
  res.json({
    message: 'Test logs generated',
    check: 'Check the console and log files for the test messages'
  });
});

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