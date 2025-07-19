# Kubernetes 部署指南

這個目錄包含在 Digital Ocean Kubernetes 上部署 MDM POC 的配置檔案。

## 前置需求

1. **Digital Ocean Kubernetes 叢集**
2. **kubectl** 已安裝並配置
3. **doctl** CLI 工具
4. **Docker 映像** 已推送到 Digital Ocean Container Registry

## 部署步驟

### 1. 設定 kubectl 上下文

```bash
# 列出你的 Kubernetes 叢集
doctl kubernetes cluster list

# 設定 kubectl 上下文
doctl kubernetes cluster kubeconfig save your-cluster-name
```

### 2. 更新配置檔案

編輯 `deployment.yaml` 和 `ingress.yaml`，將以下值替換為你的實際值：

- `registry.digitalocean.com/your-registry/mdm-poc:latest` → 你的映像位置
- `your-domain.com` → 你的網域名稱

### 3. 部署應用程式

```bash
# 建立命名空間 (可選)
kubectl create namespace mdm-poc

# 部署應用程式
kubectl apply -f deployment.yaml

# 部署 Ingress (如果需要 HTTPS)
kubectl apply -f ingress.yaml
```

### 4. 檢查部署狀態

```bash
# 檢查 Pod 狀態
kubectl get pods -l app=mdm-poc

# 檢查服務狀態
kubectl get services

# 檢查 Ingress 狀態
kubectl get ingress
```

### 5. 查看日誌

```bash
# 查看 Pod 日誌
kubectl logs -f deployment/mdm-poc

# 查看特定 Pod 日誌
kubectl logs -f pod/mdm-poc-xxxxx
```

## 配置說明

### Deployment

- **replicas: 2** - 運行 2 個 Pod 副本
- **resources** - 設定 CPU 和記憶體限制
- **livenessProbe** - 存活探針，檢查 `/health` 端點
- **readinessProbe** - 就緒探針，確保 Pod 準備好接收流量

### Service

- **type: LoadBalancer** - 建立負載平衡器
- **port: 80** - 外部端口
- **targetPort: 3000** - 容器端口

### Ingress

- **SSL 重定向** - 強制 HTTPS
- **TLS 終止** - 使用 Let's Encrypt 憑證
- **域名路由** - 根據域名路由流量

## 監控和維護

### 擴展應用程式

```bash
# 擴展到 3 個副本
kubectl scale deployment mdm-poc --replicas=3
```

### 更新映像

```bash
# 更新到新版本
kubectl set image deployment/mdm-poc mdm-poc=registry.digitalocean.com/your-registry/mdm-poc:v2.0.0
```

### 回滾部署

```bash
# 查看部署歷史
kubectl rollout history deployment/mdm-poc

# 回滾到上一個版本
kubectl rollout undo deployment/mdm-poc
```

## 故障排除

### 常見問題

1. **Pod 無法啟動**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **服務無法訪問**
   ```bash
   kubectl get services
   kubectl describe service mdm-poc-service
   ```

3. **Ingress 問題**
   ```bash
   kubectl get ingress
   kubectl describe ingress mdm-poc-ingress
   ```

### 健康檢查

```bash
# 測試健康檢查端點
kubectl port-forward service/mdm-poc-service 8080:80
curl http://localhost:8080/health
```

## 清理

```bash
# 刪除所有資源
kubectl delete -f deployment.yaml
kubectl delete -f ingress.yaml
``` 