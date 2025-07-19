# 故障排除指南

這個指南幫助你解決 MDM POC 專案中的常見問題。

## 進程管理問題

### 問題：nodemon 關不乾淨

**症狀：**
- 多次執行 `npm run dev` 後，有多個 nodemon 進程在運行
- 端口 3001 被佔用，無法啟動新的服務
- 終端顯示 "address already in use" 錯誤

**解決方案：**

1. **使用清理腳本 (推薦)**
   ```bash
   npm run cleanup
   ```

2. **手動清理**
   ```bash
   # 停止所有 nodemon 進程
   pkill -f nodemon

   # 停止所有 node 應用進程
   pkill -f "node src/app.js"

   # 停止所有 npm run 進程
   pkill -f "npm run"

   # 停止所有 ngrok 進程
   pkill -f ngrok
   ```

3. **檢查端口使用情況**
   ```bash
   # 檢查端口 3001
   lsof -i :3001

   # 檢查端口 4040 (ngrok)
   lsof -i :4040
   ```

4. **強制終止進程 (最後手段)**
   ```bash
   # 找到進程 ID
   ps aux | grep nodemon

   # 強制終止
   kill -9 <PID>
   ```

### 問題：ngrok 無法連接

**症狀：**
- ngrok 顯示 "ERR_NGROK_8012" 錯誤
- 無法通過公網 URL 訪問服務

**解決方案：**

1. **檢查本地服務是否運行**
   ```bash
   curl http://localhost:3001/health
   ```

2. **檢查 ngrok 配置**
   ```bash
   ngrok config check --config=ngrok.yml
   ```

3. **重新啟動 ngrok**
   ```bash
   # 停止所有 ngrok 進程
   pkill -f ngrok

   # 重新啟動
   npm run ngrok:config
   ```

## 端口衝突問題

### 問題：端口 3001 被其他服務佔用

**解決方案：**

1. **找出佔用端口的進程**
   ```bash
   lsof -i :3001
   ```

2. **停止佔用端口的進程**
   ```bash
   kill -9 <PID>
   ```

3. **或者修改服務端口**
   ```bash
   # 編輯 .env 檔案
   echo "PORT=3002" > .env

   # 更新 ngrok 配置
   # 編輯 ngrok.yml，將 addr 改為 3002
   ```

## 環境變數問題

### 問題：環境變數未正確載入

**症狀：**
- 服務使用預設端口而不是設定的端口
- 日誌級別不正確

**解決方案：**

1. **檢查 .env 檔案**
   ```bash
   cat .env
   ```

2. **重新建立 .env 檔案**
   ```bash
   cp env.example .env
   # 編輯 .env 檔案
   ```

3. **重新啟動服務**
   ```bash
   npm run cleanup
   npm run dev
   ```

## 權限問題

### 問題：腳本無法執行

**症狀：**
- `npm run cleanup` 顯示權限錯誤

**解決方案：**

1. **給予執行權限**
   ```bash
   chmod +x scripts/cleanup.sh
   ```

2. **檢查檔案權限**
   ```bash
   ls -la scripts/cleanup.sh
   ```

## 網路問題

### 問題：無法從外部訪問

**症狀：**
- 本地可以訪問，但外部無法訪問
- ngrok 顯示連接錯誤

**解決方案：**

1. **檢查防火牆設定**
   ```bash
   # macOS
   sudo pfctl -s rules
   ```

2. **檢查 CORS 設定**
   ```bash
   # 確認 ALLOWED_ORIGINS 設定正確
   cat .env | grep ALLOWED_ORIGINS
   ```

3. **使用不同的 ngrok 區域**
   ```bash
   # 在 ngrok.yml 中設定區域
   region: jp  # 或其他區域
   ```

## 日誌問題

### 問題：日誌檔案過大

**解決方案：**

1. **清理日誌檔案**
   ```bash
   # 清理舊日誌
   rm -f logs/*.log

   # 或者只保留最近的日誌
   find logs/ -name "*.log" -mtime +7 -delete
   ```

2. **設定日誌輪轉**
   ```bash
   # 在 .env 中設定日誌級別
   echo "LOG_LEVEL=warn" >> .env
   ```

## 常見錯誤訊息

### EADDRINUSE
```
Error: listen EADDRINUSE: address already in use :::3001
```
**解決方案：** 使用 `npm run cleanup` 清理進程

### ENOENT
```
Error: ENOENT: no such file or directory, open '.env'
```
**解決方案：** 複製 `env.example` 到 `.env`

### EACCES
```
Error: EACCES: permission denied
```
**解決方案：** 檢查檔案權限，使用 `chmod +x` 給予執行權限

## 預防措施

### 1. 使用清理腳本
在停止服務時，總是使用：
```bash
npm run cleanup
```

### 2. 檢查進程狀態
定期檢查是否有殘留進程：
```bash
ps aux | grep -E "(nodemon|node.*src/app.js|ngrok)" | grep -v grep
```

### 3. 監控端口使用
檢查端口是否被正確釋放：
```bash
lsof -i :3001
lsof -i :4040
```

### 4. 使用環境變數
確保正確設定環境變數：
```bash
cp env.example .env
# 編輯 .env 檔案
```

## 獲取幫助

如果以上解決方案都無法解決問題：

1. **檢查日誌檔案**
   ```bash
   tail -f logs/combined.log
   ```

2. **重新啟動整個系統**
   ```bash
   npm run cleanup
   # 等待幾秒
   npm run dev
   ```

3. **重新安裝依賴**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
