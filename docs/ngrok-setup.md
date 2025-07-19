# ngrok 設定指南

這個指南說明如何設定和使用 ngrok 來測試 MDM Profile 生成功能。

## 安裝 ngrok

### macOS
```bash
brew install ngrok
```

### 其他平台
從 [ngrok 官網](https://ngrok.com/download) 下載並安裝。

## 設定 ngrok

### 1. 註冊 ngrok 帳號
1. 前往 [ngrok.com](https://ngrok.com) 註冊免費帳號
2. 獲取你的 auth token

### 2. 認證 ngrok
```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

### 3. 設定配置檔案
複製 `ngrok.yml.example` 到 `ngrok.yml` 並編輯：

```bash
cp ngrok.yml.example ngrok.yml
```

編輯 `ngrok.yml`：
```yaml
version: "2"
authtoken: "your_actual_auth_token_here"

tunnels:
  mdm-poc:
    addr: 3000
    proto: http
    subdomain: mdm-poc  # 需要付費帳號
    inspect: true
```

## 使用方式

### 基本使用
```bash
# 啟動開發伺服器
npm run dev

# 在另一個終端啟動 ngrok
npm run ngrok
```

### 使用配置檔案
```bash
# 使用配置檔案啟動
npm run ngrok:config

# 同時啟動開發伺服器和 ngrok
npm run tunnel:config
```

### 可用的指令

| 指令 | 說明 |
|------|------|
| `npm run ngrok` | 基本 HTTP 隧道 |
| `npm run ngrok:https` | HTTPS 隧道 |
| `npm run ngrok:subdomain` | 自定義子域名 (需付費) |
| `npm run ngrok:config` | 使用配置檔案 |
| `npm run tunnel` | 同時啟動開發伺服器和 ngrok |
| `npm run tunnel:config` | 使用配置檔案同時啟動 |

## 測試 MDM Profile

啟動 ngrok 後，你會看到類似這樣的輸出：

```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       51ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

### 測試 Web Clip Profile
```bash
# 使用公網 URL 測試
curl "https://abc123.ngrok.io/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com" -o myapp.mobileconfig

# 在 iOS 裝置上直接訪問
# 在 Safari 中打開：https://abc123.ngrok.io/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com
```

### 測試 VPN Profile
```bash
curl "https://abc123.ngrok.io/mdm/vpn?vpnName=My%20VPN&vpnServer=vpn.mycompany.com" -o vpn.mobileconfig
```

## 注意事項

1. **免費帳號限制**：
   - 每次啟動會得到不同的 URL
   - 無法使用自定義子域名
   - 有連接數限制

2. **付費帳號優勢**：
   - 可以使用固定的子域名
   - 更高的連接數限制
   - 更多功能

3. **安全性**：
   - ngrok 會將你的本地服務暴露到公網
   - 確保不要在生產環境中使用
   - 僅用於開發和測試

## 故障排除

### 常見問題

1. **ngrok 無法啟動**
   ```bash
   # 檢查 auth token
   ngrok authtoken YOUR_TOKEN

   # 檢查配置檔案
   ngrok config check
   ```

2. **端口被佔用**
   ```bash
   # 檢查端口 3000 是否被佔用
   lsof -i :3000

   # 殺死佔用端口的程序
   kill -9 PID
   ```

3. **iOS 裝置無法訪問**
   - 確保使用 HTTPS URL
   - 檢查防火牆設定
   - 嘗試使用不同的 ngrok 區域
