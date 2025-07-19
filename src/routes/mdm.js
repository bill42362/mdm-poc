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



// GET /webclip - 回傳 iOS Web Clip MDM Profile
router.get('/webclip', (req, res) => {
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
      webClipIcon: 'string (optional) - Icon URL for web clip'
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

// 輔助函數：生成圖示資料 (簡化版本)
function generateIconData(iconUrl) {
  // 這裡可以加入實際的圖示下載和轉換邏輯
  // 目前返回空字串，讓系統使用預設圖示
  return '';
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