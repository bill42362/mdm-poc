const express = require('express');
const { logger } = require('../logger');

const router = express.Router();

// GET /api/status
router.get('/status', (req, res) => {
  logger.info('API status endpoint accessed');
  res.json({
    message: 'MDM POC Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// GET /api/test-logs
router.get('/test-logs', (req, res) => {
  logger.info('This is an info log message');
  logger.warn('This is a warning log message');
  logger.error('This is an error log message');
  
  res.json({
    message: 'Test logs generated',
    check: 'Check the console and log files for the test messages'
  });
});

// 範例：GET /api/users
router.get('/users', (req, res) => {
  logger.info('Users endpoint accessed');
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    total: 2
  });
});

// 範例：POST /api/users
router.post('/users', (req, res) => {
  logger.info('Create user request', { body: req.body });
  
  // 這裡可以加入資料驗證邏輯
  const { name, email } = req.body;
  
  if (!name || !email) {
    logger.warn('Invalid user data provided');
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }
  
  // 模擬建立使用者
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  logger.info('User created successfully', { userId: newUser.id });
  res.status(201).json(newUser);
});

// 範例：GET /api/users/:id
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  logger.info('Get user by ID', { userId: id });
  
  // 模擬查詢使用者
  const user = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString()
  };
  
  res.json(user);
});

module.exports = router; 