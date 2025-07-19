# Digital Ocean 部署指南

這個目錄包含將 iOS MDM Profile Generator 部署到 Digital Ocean 的相關配置檔案。

## 部署選項

### 1. Digital Ocean App Platform (推薦)

最簡單的部署方式，適合小型專案：

```bash
# 使用 doctl CLI 部署
doctl apps create --spec deployment/digitalocean-app.yaml
```

### 2. Digital Ocean Droplet + Docker

適合需要更多控制的部署：

```bash
# 1. 建立 Droplet
# 2. 安裝 Docker 和 Docker Compose
# 3. 複製專案檔案
# 4. 執行部署
docker-compose -f deployment/docker-compose.prod.yml up -d
```

### 3. Digital Ocean Kubernetes

適合大型專案和微服務架構：

```bash
# 使用提供的 Kubernetes 配置檔案
kubectl apply -f deployment/k8s/
```

## 部署步驟

### 準備工作

1. **建立 Digital Ocean Container Registry**
   ```bash
   doctl registry create your-registry-name
   ```

2. **認證 Docker 到 Digital Ocean Registry**
   ```bash
   doctl registry login
   ```

3. **建立和推送 Docker 映像**
   ```bash
   ./scripts/build-and-push.sh registry.digitalocean.com your-registry/mdm-poc latest
   ```

### 環境變數設定

在 Digital Ocean 控制台或使用 CLI 設定以下環境變數：

- `NODE_ENV=production`
- `PORT=3000`
- `LOG_LEVEL=info`
- `ALLOWED_ORIGINS=your-domain.com`

### 健康檢查

應用程式提供 `/health` 端點用於健康檢查：

```bash
curl https://your-domain.com/health
```

## 監控和日誌

### 日誌查看

- **App Platform**: 在 Digital Ocean 控制台查看
- **Droplet**: 使用 `docker logs mdm-poc-server`
- **Kubernetes**: 使用 `kubectl logs -f deployment/mdm-poc`

### 監控

- 設定 Digital Ocean 監控
- 使用 `/health` 端點進行健康檢查
- 監控日誌檔案大小和輪轉

## 安全考量

1. **HTTPS**: 啟用 SSL 憑證
2. **防火牆**: 只開放必要端口
3. **環境變數**: 不要在程式碼中硬編碼敏感資訊
4. **定期更新**: 保持 Docker 映像和依賴更新

## 故障排除

### 常見問題

1. **容器無法啟動**
   - 檢查環境變數設定
   - 查看容器日誌

2. **健康檢查失敗**
   - 確認 `/health` 端點可訪問
   - 檢查網路連接

3. **日誌檔案過大**
   - 調整日誌級別
   - 設定日誌輪轉

### 支援

如有問題，請檢查：
- 應用程式日誌
- Digital Ocean 控制台
- 網路連接狀態 