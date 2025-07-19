# 使用 Node.js 18 Alpine 作為基礎映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝系統依賴
RUN apk add --no-cache dumb-init

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production && npm cache clean --force

# 複製應用程式程式碼
COPY src/ ./src/

# 建立 logs 目錄
RUN mkdir -p logs && chown -R node:node logs

# 切換到非 root 使用者
USER node

# 暴露端口
EXPOSE 3000

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 使用 dumb-init 作為 init 系統
ENTRYPOINT ["dumb-init", "--"]

# 啟動應用程式
CMD ["node", "src/app.js"]
