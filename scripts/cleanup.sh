#!/bin/bash

# MDM POC 清理腳本
# 停止所有相關的進程和服務

echo "🧹 開始清理 MDM POC 相關進程..."

# 停止 nodemon 進程
echo "📝 停止 nodemon 進程..."
pkill -f nodemon 2>/dev/null || echo "  沒有找到 nodemon 進程"

# 停止 node 應用進程
echo "🟢 停止 node 應用進程..."
pkill -f "node src/app.js" 2>/dev/null || echo "  沒有找到 node 應用進程"

# 停止 npm run 進程
echo "📦 停止 npm run 進程..."
pkill -f "npm run" 2>/dev/null || echo "  沒有找到 npm run 進程"

# 停止 ngrok 進程
echo "🌐 停止 ngrok 進程..."
pkill -f "ngrok" 2>/dev/null || echo "  沒有找到 ngrok 進程"

# 檢查端口使用情況
echo "🔍 檢查端口使用情況..."
if lsof -i :3001 >/dev/null 2>&1; then
    echo "  ⚠️  端口 3001 仍被佔用:"
    lsof -i :3001
else
    echo "  ✅ 端口 3001 已釋放"
fi

if lsof -i :4040 >/dev/null 2>&1; then
    echo "  ⚠️  端口 4040 (ngrok) 仍被佔用:"
    lsof -i :4040
else
    echo "  ✅ 端口 4040 已釋放"
fi

# 檢查殘留進程
echo "🔍 檢查殘留進程..."
RESIDUAL_PROCESSES=$(ps aux | grep -E "(nodemon|node.*src/app.js|npm.*run|ngrok)" | grep -v grep | grep -v cleanup.sh)

if [ -n "$RESIDUAL_PROCESSES" ]; then
    echo "  ⚠️  發現殘留進程:"
    echo "$RESIDUAL_PROCESSES"
    echo ""
    echo "💡 如果還有進程無法停止，可以使用以下指令強制終止:"
    echo "   kill -9 <PID>"
else
    echo "  ✅ 沒有發現殘留進程"
fi

echo ""
echo "🎉 清理完成！"
echo ""
echo "💡 重新啟動服務:"
echo "   npm run dev          # 啟動開發伺服器"
echo "   npm run tunnel:config # 同時啟動開發伺服器和 ngrok" 