# 故障排除指南

## 常見問題和解決方案

### 1. CSP (Content Security Policy) 錯誤

#### 問題描述
```
Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'".
```

#### 解決方案
我們已經將所有內聯腳本移到外部文件中，並配置了安全的 CSP 策略：

1. **使用外部 JavaScript 文件**: 所有腳本邏輯都在 `/assets/js/mdm-generator.js` 中
2. **移除內聯事件處理器**: 使用 `addEventListener` 替代 `onclick` 等內聯事件
3. **安全的 CSP 配置**: 只允許來自同源的腳本執行
4. **無需 `unsafe-inline`**: 避免了安全風險

如果仍然遇到 CSP 錯誤，請檢查：
- 確保服務器正在運行
- 確保外部 JavaScript 文件可以訪問：`http://localhost:3001/assets/js/mdm-generator.js`
- 清除瀏覽器快取
- 檢查是否有其他內聯事件處理器（如 `onclick`、`onload` 等）

### 2. 內聯事件處理器錯誤

#### 問題描述
```
Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src-attr 'none'".
```

#### 解決方案
我們已經將所有內聯事件處理器（如 `onclick`、`onload` 等）替換為 `addEventListener`：

1. **使用 data 屬性**: 將 `onclick="function()"` 改為 `data-toggle="sectionId"`
2. **使用 addEventListener**: 在 JavaScript 中綁定事件監聽器
3. **保持功能完整**: 所有功能都正常工作，只是實現方式更安全

如果仍然遇到此錯誤，請檢查：
- 確保沒有遺漏的內聯事件處理器
- 清除瀏覽器快取
- 檢查是否有其他 HTML 文件包含內聯事件處理器

### 3. 服務器無法啟動

#### 問題描述
```
Error: listen EADDRINUSE: address already in use :::3001
```

#### 解決方案
1. **檢查端口使用情況**:
   ```bash
   lsof -i :3001
   ```

2. **停止佔用端口的進程**:
   ```bash
   kill -9 <PID>
   ```

3. **或者使用不同端口**:
   修改 `src/app.js` 中的端口設定

### 4. MDM 生成器頁面無法訪問

#### 問題描述
```
404 Not Found
```

#### 解決方案
1. **確認路由配置**:
   - 檢查 `src/routes/mdm.js` 中是否有 `/generator` 路由
   - 確認 HTML 文件存在於 `src/assets/html/mdm-generator.html`

2. **檢查文件路徑**:
   ```bash
   ls -la src/assets/html/mdm-generator.html
   ls -la src/assets/js/mdm-generator.js
   ```

3. **重啟服務器**:
   ```bash
   npm start
   ```

### 5. JavaScript 功能無法正常工作

#### 問題描述
- 按鈕點擊無反應
- 表單提交失敗
- 下載功能異常

#### 解決方案
1. **檢查瀏覽器控制台**:
   - 打開開發者工具 (F12)
   - 查看 Console 標籤中的錯誤訊息

2. **確認 JavaScript 文件載入**:
   ```bash
   curl -s http://localhost:3001/assets/js/mdm-generator.js | head -n 5
   ```

3. **檢查網路請求**:
   - 在開發者工具的 Network 標籤中查看請求狀態

### 6. 下載功能無法使用

#### 問題描述
- 點擊下載按鈕無反應
- 下載的檔案損壞
- 檔案類型錯誤

#### 解決方案
1. **檢查瀏覽器支援**:
   - 確認瀏覽器支援 Blob API
   - 檢查瀏覽器下載設定

2. **檢查生成的 XML**:
   - 使用預覽功能檢查 XML 格式是否正確
   - 確認所有必填欄位都已填寫

3. **檢查檔案類型**:
   - 確認 MIME 類型設定為 `application/x-apple-aspen-config`

### 7. 表單驗證問題

#### 問題描述
- 必填欄位驗證失敗
- URL 格式驗證錯誤
- 日期格式問題

#### 解決方案
1. **檢查必填欄位**:
   - 配置檔案名稱
   - 組織名稱
   - 配置檔案識別碼
   - Web Clip 標題
   - Web Clip URL

2. **URL 格式驗證**:
   - 確保 URL 包含協議 (http:// 或 https://)
   - 檢查 URL 是否有效

3. **日期格式**:
   - 使用瀏覽器的 datetime-local 輸入
   - 確保日期格式正確

### 8. 測試腳本失敗

#### 問題描述
```bash
❌ MDM Generator page is not accessible
```

#### 解決方案
1. **確認服務器狀態**:
   ```bash
   curl -s http://localhost:3001/mdm/status
   ```

2. **檢查頁面內容**:
   ```bash
   curl -s http://localhost:3001/mdm/generator | grep "MDM 配置生成器"
   ```

3. **檢查 JavaScript 文件**:
   ```bash
   curl -s http://localhost:3001/assets/js/mdm-generator.js | grep "generateMDM"
   ```

### 9. 生成的 MDM 配置檔案無效

#### 問題描述
- iOS 顯示 "Invalid Profile" 錯誤
- 配置檔案無法安裝

#### 解決方案
1. **檢查 XML 格式**:
   - 使用預覽功能檢查生成的 XML
   - 確認 XML 結構完整

2. **檢查必填欄位**:
   - 確認所有必填欄位都已填寫
   - 檢查欄位值是否有效

3. **檢查布爾值格式**:
   - 確認 `IsRemovable` 和 `FullScreen` 使用正確的布爾值格式 (`<true/>` 或 `<false/>`)

4. **檢查日期格式**:
   - 確認日期使用 ISO 8601 格式
   - 檢查時區設定

### 10. 效能問題

#### 問題描述
- 頁面載入緩慢
- 生成配置檔案時延遲

#### 解決方案
1. **檢查網路連接**:
   - 確認網路連接穩定
   - 檢查防火牆設定

2. **清除瀏覽器快取**:
   - 清除瀏覽器快取和 Cookie
   - 重新載入頁面

3. **檢查資源載入**:
   - 確認 CSS 和 JavaScript 文件載入正常
   - 檢查是否有 404 錯誤

## 日誌和調試

### 查看服務器日誌
```bash
# 查看即時日誌
tail -f logs/app.log

# 查看錯誤日誌
tail -f logs/error.log
```

### 瀏覽器調試
1. **開啟開發者工具** (F12)
2. **查看 Console 標籤** 中的錯誤訊息
3. **查看 Network 標籤** 中的請求狀態
4. **使用 Sources 標籤** 調試 JavaScript

### 測試工具
```bash
# 運行完整測試
./scripts/test-mdm-generator.sh

# 測試特定功能
curl -s http://localhost:3001/mdm/generator
curl -s http://localhost:3001/assets/js/mdm-generator.js
```

## 聯繫支援

如果以上解決方案都無法解決問題，請：

1. **收集錯誤訊息**:
   - 瀏覽器控制台錯誤
   - 服務器日誌
   - 錯誤截圖

2. **提供環境資訊**:
   - 作業系統版本
   - 瀏覽器版本
   - Node.js 版本

3. **重現步驟**:
   - 詳細描述問題發生的步驟
   - 提供測試數據
