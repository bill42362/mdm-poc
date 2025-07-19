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

// GET /api/mdm/profile - 回傳 iOS Web Clip MDM Profile
router.get('/mdm/profile', (req, res) => {
  logger.info('Web Clip MDM profile requested', { 
    userAgent: req.get('User-Agent'),
    ip: req.ip 
  });

  // 從查詢參數獲取配置
  const { 
    profileName = 'Web Clip Profile',
    organization = 'Your Organization',
    description = 'Web Clip Profile for quick web app access',
    identifier = 'com.yourcompany.webclip.profile',
    webClipName = 'My Web App',
    webClipURL = 'https://example.com',
    webClipIcon = 'https://example.com/icon.png'
  } = req.query;

  // 生成 Web Clip MDM Profile XML
  const mdmProfile = generateWebClipProfile({
    profileName,
    organization,
    description,
    identifier,
    webClipName,
    webClipURL,
    webClipIcon
  });

  // 設定回應標頭
  res.set({
    'Content-Type': 'application/x-apple-aspen-config',
    'Content-Disposition': `attachment; filename="${profileName}.mobileconfig"`,
    'Cache-Control': 'no-cache'
  });

  res.send(mdmProfile);
});

// GET /api/mdm/profile/info - 取得 MDM Profile 資訊
router.get('/mdm/profile/info', (req, res) => {
  logger.info('MDM profile info requested');
  
  res.json({
    description: 'Web Clip MDM Profile Generator',
    endpoint: '/api/mdm/profile',
    method: 'GET',
    parameters: {
      profileName: 'string (optional) - Profile display name',
      organization: 'string (optional) - Organization name',
      description: 'string (optional) - Profile description',
      identifier: 'string (optional) - Profile identifier',
      webClipName: 'string (optional) - Web clip name on home screen',
      webClipURL: 'string (optional) - Web app URL',
      webClipIcon: 'string (optional) - Icon URL for web clip'
    },
    example: {
      url: '/api/mdm/profile?webClipName=My%20App&webClipURL=https://myapp.com&organization=My%20Company'
    }
  });
});

// 輔助函數：生成 Web Clip MDM Profile
function generateWebClipProfile({ profileName, organization, description, identifier, webClipName, webClipURL, webClipIcon }) {
  const uuid = generateUUID();
  const webClipUUID = generateUUID();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>${identifier}.webclip</string>
            <key>PayloadUUID</key>
            <string>${webClipUUID}</string>
            <key>PayloadDisplayName</key>
            <string>${webClipName}</string>
            <key>PayloadDescription</key>
            <string>Web Clip for ${webClipName}</string>
            <key>PayloadOrganization</key>
            <string>${organization}</string>
            <key>URL</key>
            <string>${webClipURL}</string>
            <key>Label</key>
            <string>${webClipName}</string>
            <key>Icon</key>
            <data>${webClipIcon ? generateIconData(webClipIcon) : ''}</data>
            <key>IsRemovable</key>
            <true/>
            <key>Precomposed</key>
            <true/>
        </dict>
    </array>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadIdentifier</key>
    <string>${identifier}</string>
    <key>PayloadUUID</key>
    <string>${uuid}</string>
    <key>PayloadDisplayName</key>
    <string>${profileName}</string>
    <key>PayloadDescription</key>
    <string>${description}</string>
    <key>PayloadOrganization</key>
    <string>${organization}</string>
    <key>PayloadExpirationDate</key>
    <date>2026-12-31T23:59:59Z</date>
</dict>
</plist>`;
}

// 輔助函數：生成 UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 輔助函數：生成圖示資料 (簡化版本)
function generateIconData(iconUrl) {
  // 這裡可以加入實際的圖示下載和轉換邏輯
  // 目前返回空字串，讓系統使用預設圖示
  return '';
}

module.exports = router; 