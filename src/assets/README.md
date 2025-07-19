# Assets 目錄

這個目錄用於存放 MDM Profile 相關的靜態資源檔案。

## 目錄結構

```
src/assets/
├── icons/           # WebClip Profile 圖示檔案
│   ├── default.png  # 預設圖示
│   ├── app1.png     # 應用程式 1 圖示
│   ├── app2.png     # 應用程式 2 圖示
│   └── ...          # 其他圖示檔案
└── README.md        # 本說明檔案
```

## 圖示檔案要求

### WebClip Icon 規格

- **格式**: PNG 或 JPG
- **尺寸**: 建議 180x180 像素 (iOS 標準)
- **檔案大小**: 建議小於 100KB
- **背景**: 透明背景 (PNG) 或純色背景
- **命名**: 使用小寫字母和數字，用連字號分隔

### 支援的圖示格式

1. **PNG** - 推薦格式，支援透明背景
2. **JPG/JPEG** - 適用於不透明圖示
3. **SVG** - 向量格式 (需要轉換為 PNG)

## 使用方式

### 1. 在 MDM Profile 中引用圖示

```javascript
// 在 src/routes/mdm.js 中
const iconPath = path.join(__dirname, '../assets/icons/app1.png');
const iconData = fs.readFileSync(iconPath);
const iconBase64 = iconData.toString('base64');
```

### 2. 透過 URL 參數指定圖示

```bash
# 使用預設圖示
curl "http://localhost:3001/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com" -o app.mobileconfig

# 使用自訂圖示
curl "http://localhost:3001/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&webClipIcon=app1" -o app.mobileconfig
```

## 圖示命名規範

### 建議的命名方式

- `default.png` - 預設圖示
- `app-{name}.png` - 特定應用圖示
- `company-{name}.png` - 公司相關圖示
- `service-{name}.png` - 服務相關圖示

### 範例

```
icons/
├── default.png          # 預設圖示
├── app-gmail.png        # Gmail 圖示
├── app-slack.png        # Slack 圖示
├── company-logo.png     # 公司標誌
├── service-vpn.png      # VPN 服務圖示
└── web-app.png          # 網頁應用圖示
```

## 圖示準備指南

### 1. 準備圖示檔案

1. **選擇合適的圖示**
   - 使用高品質的圖示
   - 確保圖示清晰可辨識
   - 避免過於複雜的設計

2. **調整尺寸**
   - 主要尺寸：180x180 像素
   - 備用尺寸：120x120 像素
   - 確保在不同尺寸下都清晰

3. **優化檔案**
   - 壓縮 PNG 檔案
   - 移除不必要的元資料
   - 確保檔案大小合理

### 2. 轉換工具

```bash
# 使用 ImageMagick 調整尺寸
convert original.png -resize 180x180 app-icon.png

# 使用 sips (macOS)
sips -z 180 180 original.png --out app-icon.png

# 壓縮 PNG
pngquant --quality=65-80 app-icon.png
```

## 注意事項

1. **版權問題** - 確保使用的圖示有適當的授權
2. **檔案大小** - 避免過大的圖示檔案影響載入速度
3. **備份** - 保留原始圖示檔案的備份
4. **版本控制** - 將圖示檔案加入版本控制

## 未來擴展

- 支援更多圖示格式 (SVG, WebP)
- 自動圖示生成功能
- 圖示預覽功能
- 圖示管理介面 