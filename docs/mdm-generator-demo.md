# MDM 配置生成器 - Client-Side 版本

這是一個完全在瀏覽器中運行的 iOS MDM 配置檔案生成器，無需伺服器端處理即可生成和下載 MDM 配置檔案。

## 功能特色

- 🚀 **完全客戶端運行**: 所有處理都在瀏覽器中完成，無需伺服器端生成
- 📱 **iOS MDM 格式**: 生成標準的 `.mobileconfig` 檔案格式
- 🎨 **美觀的 UI**: 現代化的響應式設計，支援手機和桌面瀏覽
- ⚡ **即時預覽**: 可以預覽生成的 XML 內容
- 💾 **一鍵下載**: 直接下載生成的配置檔案
- 📋 **剪貼簿支援**: 複製 XML 內容到剪貼簿
- 🔧 **進階設定**: 支援過期日期、移除日期等進階選項

## 快速開始

### 1. 啟動服務器

```bash
npm start
```

### 2. 訪問生成器

在瀏覽器中打開：
```
http://localhost:3001/mdm/generator
```

### 3. 填寫表單

1. **基本設定**
   - 配置檔案名稱
   - 組織名稱
   - 配置檔案識別碼
   - 描述

2. **Web Clip 設定**
   - Web Clip 標題
   - URL
   - 圖示 (可選)
   - 允許移除
   - 全螢幕模式

3. **進階設定** (可選)
   - 過期日期
   - 移除日期
   - 範圍 (系統/使用者)

### 4. 生成和下載

1. 點擊「生成 MDM 配置」
2. 預覽生成的 XML 內容
3. 點擊「下載配置檔案」或「複製到剪貼簿」

## 技術實現

### 前端技術
- **HTML5**: 語義化標籤和表單元素
- **CSS3**: Flexbox、Grid、動畫效果
- **JavaScript ES6+**: 模組化程式碼、Promise、async/await

### 核心功能

#### 1. UUID 生成
```javascript
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
```

#### 2. MDM XML 生成
```javascript
function generateMDMXML(data) {
    // 生成符合 Apple 規範的 plist XML
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            // ... 更多配置
        </dict>
    </array>
    // ... 更多設定
</dict>
</plist>`;
}
```

#### 3. 檔案下載
```javascript
function downloadMDM() {
    const blob = new Blob([window.generatedXML], { 
        type: 'application/x-apple-aspen-config' 
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = window.generatedFileName;
    a.click();
    
    URL.revokeObjectURL(url);
}
```

### 安全性考量

1. **CSP 合規**: 使用外部 JavaScript 檔案，避免內聯腳本
2. **輸入驗證**: 客戶端和伺服器端都進行輸入驗證
3. **檔案類型**: 正確設定 MIME 類型為 `application/x-apple-aspen-config`

## 與伺服器端版本比較

| 特性 | Client-Side | Server-Side |
|------|-------------|-------------|
| 處理位置 | 瀏覽器 | 伺服器 |
| 網路依賴 | 僅載入頁面 | 每次生成都需要請求 |
| 隱私 | 完全本地處理 | 資料可能記錄在伺服器 |
| 效能 | 即時響應 | 需要網路延遲 |
| 離線使用 | 載入後可離線 | 需要網路連接 |
| 客製化 | 容易修改 | 需要伺服器端修改 |

## 使用範例

### 基本 Web Clip 配置

```javascript
// 生成的配置範例
{
    profileName: "SWAG Web Clip Profile",
    organization: "SWAG Inc.",
    identifier: "com.swag.webclip",
    webclipTitle: "SWAG App",
    webclipUrl: "https://swag.com",
    isRemovable: true,
    fullScreen: false
}
```

### 進階配置

```javascript
// 包含進階設定的配置
{
    profileName: "SWAG Enterprise Web Clip",
    organization: "SWAG Enterprise",
    identifier: "com.swag.enterprise.webclip",
    webclipTitle: "SWAG Enterprise",
    webclipUrl: "https://enterprise.swag.com",
    isRemovable: false,
    fullScreen: true,
    expirationDate: "2025-12-31T23:59:59",
    scope: "System"
}
```

## 故障排除

### 常見問題

1. **頁面無法載入**
   - 確認服務器正在運行
   - 檢查端口 3001 是否可用

2. **JavaScript 錯誤**
   - 檢查瀏覽器控制台
   - 確認外部 JS 檔案可以載入

3. **下載失敗**
   - 確認瀏覽器支援 Blob API
   - 檢查瀏覽器下載設定

4. **生成的檔案無效**
   - 確認所有必填欄位都已填寫
   - 檢查 URL 格式是否正確

### 測試

運行測試腳本來驗證功能：

```bash
./scripts/test-mdm-generator.sh
```

## 未來改進

- [ ] 支援更多 MDM 配置類型 (VPN、WiFi 等)
- [ ] 添加配置檔案模板
- [ ] 支援批量生成
- [ ] 添加配置檔案驗證
- [ ] 支援簽名配置檔案
- [ ] 添加配置檔案歷史記錄

## 相關檔案

- `src/assets/html/mdm-generator.html` - 主頁面
- `src/assets/js/mdm-generator.js` - JavaScript 邏輯
- `src/routes/mdm.js` - 路由配置
- `scripts/test-mdm-generator.sh` - 測試腳本 