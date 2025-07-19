const express = require('express');
const fs = require('fs');
const path = require('path');
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



// GET /webclip - 回傳 iOS Web Clip MDM Profile
router.get('/webclip', (req, res) => {
  logger.info('Web Clip MDM profile requested', { 
    userAgent: req.get('User-Agent'),
    ip: req.ip 
  });

  // 從查詢參數獲取配置
  const { 
    profileName = 'SWAG Web Clip Profile',
    organization = 'SWAG',
    description = 'Web Clip Profile for SWAG web app',
    identifier = 'com.swag.webclip.profile',
    webClipName = 'SWAG',
    webClipURL = 'https://swag.live?lang=zh-TW',
    webClipIcon = 'swag-apple-icon.png'  // 使用本地圖示檔案
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

// GET /webclip/info - 取得 Web Clip Profile 資訊
router.get('/webclip/info', (req, res) => {
  logger.info('MDM profile info requested');
  
  res.json({
    description: 'Web Clip MDM Profile Generator',
    endpoint: '/mdm/webclip',
    method: 'GET',
    parameters: {
      profileName: 'string (optional) - Profile display name',
      organization: 'string (optional) - Organization name',
      description: 'string (optional) - Profile description',
      identifier: 'string (optional) - Profile identifier',
      webClipName: 'string (optional) - Web clip name on home screen',
      webClipURL: 'string (optional) - Web app URL',
      webClipIcon: 'string (optional) - Icon filename in assets/icons/ (e.g., swag-apple-icon.png)'
    },
    example: {
      url: '/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&organization=My%20Company'
    }
  });
});

// GET /vpn - 回傳 iOS VPN MDM Profile (範例)
router.get('/vpn', (req, res) => {
  logger.info('VPN MDM profile requested', { 
    userAgent: req.get('User-Agent'),
    ip: req.ip 
  });

  // 從查詢參數獲取配置
  const { 
    profileName = 'VPN Profile',
    organization = 'Your Organization',
    description = 'VPN Profile for secure connection',
    identifier = 'com.yourcompany.vpn.profile',
    vpnName = 'My VPN',
    vpnServer = 'vpn.example.com',
    vpnType = 'IKEv2'
  } = req.query;

  // 生成 VPN MDM Profile XML (簡化版本)
  const vpnProfile = generateVPNProfile({
    profileName,
    organization,
    description,
    identifier,
    vpnName,
    vpnServer,
    vpnType
  });

  // 設定回應標頭
  res.set({
    'Content-Type': 'application/x-apple-aspen-config',
    'Content-Disposition': `attachment; filename="${profileName}.mobileconfig"`,
    'Cache-Control': 'no-cache'
  });

  res.send(vpnProfile);
});

// GET /vpn/info - 取得 VPN Profile 資訊
router.get('/vpn/info', (req, res) => {
  logger.info('VPN profile info requested');
  
  res.json({
    description: 'VPN MDM Profile Generator',
    endpoint: '/mdm/vpn',
    method: 'GET',
    parameters: {
      profileName: 'string (optional) - Profile display name',
      organization: 'string (optional) - Organization name',
      description: 'string (optional) - Profile description',
      identifier: 'string (optional) - Profile identifier',
      vpnName: 'string (optional) - VPN connection name',
      vpnServer: 'string (optional) - VPN server address',
      vpnType: 'string (optional) - VPN type (IKEv2, L2TP, etc.)'
    },
    example: {
      url: '/mdm/vpn?vpnName=My%20VPN&vpnServer=vpn.mycompany.com&organization=My%20Company'
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

// 輔助函數：生成圖示資料
function generateIconData(iconUrl) {
  try {
    // 如果 iconUrl 是本地檔案名稱，則讀取本地檔案
    if (iconUrl && !iconUrl.startsWith('http')) {
      const iconPath = path.join(__dirname, '../assets/icons', iconUrl);
      
      // 檢查檔案是否存在
      if (fs.existsSync(iconPath)) {
        const iconData = fs.readFileSync(iconPath);
        const base64Data = iconData.toString('base64');
        logger.info('Icon loaded from local file', { 
          iconPath, 
          fileSize: iconData.length,
          base64Length: base64Data.length 
        });
        return base64Data;
      } else {
        logger.warn('Icon file not found', { iconPath });
        return '';
      }
    }
    
    // 如果是 URL，可以加入下載邏輯（未來擴展）
    if (iconUrl && iconUrl.startsWith('http')) {
      logger.info('Icon URL provided, but local file reading is preferred', { iconUrl });
      return '';
    }
    
    // 如果沒有提供圖示，使用預設圖示
    const defaultIconPath = path.join(__dirname, '../assets/icons/swag-apple-icon.png');
    if (fs.existsSync(defaultIconPath)) {
      const iconData = fs.readFileSync(defaultIconPath);
      const base64Data = iconData.toString('base64');
      logger.info('Using default icon', { 
        defaultIconPath, 
        fileSize: iconData.length,
        base64Length: base64Data.length 
      });
      return base64Data;
    }
    
    logger.warn('No icon available, using empty icon');
    return '';
  } catch (error) {
    logger.error('Error loading icon', { error: error.message, iconUrl });
    return '';
  }
}

// 輔助函數：生成 VPN MDM Profile
function generateVPNProfile({ profileName, organization, description, identifier, vpnName, vpnServer, vpnType }) {
  const uuid = generateUUID();
  const vpnUUID = generateUUID();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.vpn.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>${identifier}.vpn</string>
            <key>PayloadUUID</key>
            <string>${vpnUUID}</string>
            <key>PayloadDisplayName</key>
            <string>${vpnName}</string>
            <key>PayloadDescription</key>
            <string>VPN Configuration for ${vpnName}</string>
            <key>PayloadOrganization</key>
            <string>${organization}</string>
            <key>UserDefinedName</key>
            <string>${vpnName}</string>
            <key>VPNType</key>
            <string>${vpnType}</string>
            <key>VendorConfig</key>
            <dict>
                <key>Server</key>
                <string>${vpnServer}</string>
            </dict>
            <key>OnDemandEnabled</key>
            <integer>0</integer>
            <key>OnDemandRules</key>
            <array>
                <dict>
                    <key>Action</key>
                    <string>Disconnect</string>
                </dict>
            </array>
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

module.exports = router; 