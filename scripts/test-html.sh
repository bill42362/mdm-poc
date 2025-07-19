#!/bin/bash

# MDM POC HTML 導向功能測試腳本

BASE_URL="http://localhost:3001"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 MDM POC HTML 導向功能測試${NC}"
echo ""

# 檢查伺服器是否運行
echo -e "${BLUE}📡 檢查伺服器狀態...${NC}"
if curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ 伺服器正在運行${NC}"
else
    echo -e "${RED}❌ 伺服器未運行，請先啟動伺服器${NC}"
    exit 1
fi

echo ""

# 測試 1: WebClip HTML 路由
echo -e "${BLUE}📄 測試 1: WebClip HTML 路由${NC}"
if curl -s "$BASE_URL/mdm/webclip/html" | grep -q "SWAG - 正在導向"; then
    echo -e "${GREEN}✅ WebClip HTML 路由正常${NC}"
else
    echo -e "${RED}❌ WebClip HTML 路由異常${NC}"
fi

# 測試 2: 靜態檔案服務
echo -e "${BLUE}📄 測試 2: 靜態檔案服務${NC}"
if curl -s "$BASE_URL/assets/html/index.html" | grep -q "SWAG - 正在導向"; then
    echo -e "${GREEN}✅ 靜態檔案服務正常${NC}"
else
    echo -e "${RED}❌ 靜態檔案服務異常${NC}"
fi

# 測試 3: JavaScript 導向功能
echo -e "${BLUE}📄 測試 3: JavaScript 導向功能${NC}"
if curl -s "$BASE_URL/mdm/webclip/html" | grep -q "window.location.replace"; then
    echo -e "${GREEN}✅ JavaScript 導向程式碼存在${NC}"
else
    echo -e "${RED}❌ JavaScript 導向程式碼缺失${NC}"
fi

# 測試 4: 目標 URL 檢查
echo -e "${BLUE}📄 測試 4: 目標 URL 檢查${NC}"
if curl -s "$BASE_URL/mdm/webclip/html" | grep -q "https://swag.live"; then
    echo -e "${GREEN}✅ 目標 URL 正確${NC}"
else
    echo -e "${RED}❌ 目標 URL 錯誤${NC}"
fi

echo ""

# 檢查 HTML 檔案內容
echo -e "${BLUE}📋 HTML 檔案內容檢查${NC}"
html_file="src/assets/html/index.html"
if [ -f "$html_file" ]; then
    file_size=$(stat -f%z "$html_file" 2>/dev/null || stat -c%s "$html_file" 2>/dev/null)
    echo -e "${GREEN}✅ HTML 檔案存在: $html_file (${file_size} bytes)${NC}"
    
    # 檢查關鍵元素
    if grep -q "SWAG" "$html_file"; then
        echo -e "${GREEN}✅ 包含 SWAG 品牌元素${NC}"
    fi
    
    if grep -q "window.location.replace" "$html_file"; then
        echo -e "${GREEN}✅ 包含 JavaScript 導向功能${NC}"
    fi
    
    if grep -q "https://swag.live" "$html_file"; then
        echo -e "${GREEN}✅ 包含正確的目標 URL${NC}"
    fi
else
    echo -e "${RED}❌ HTML 檔案不存在${NC}"
fi

echo ""

# 顯示檔案結構
echo -e "${BLUE}📁 檔案結構${NC}"
echo "src/assets/html/"
ls -la src/assets/html/

echo ""

# 顯示訪問 URL
echo -e "${BLUE}🌐 訪問 URL${NC}"
echo "  WebClip HTML: $BASE_URL/mdm/webclip/html"
echo "  靜態檔案: $BASE_URL/assets/html/index.html"
echo ""

# 顯示功能說明
echo -e "${BLUE}💡 功能說明${NC}"
echo "  • 3 秒倒數計時後自動導向到 https://swag.live"
echo "  • 如果自動導向失敗，提供手動按鈕"
echo "  • 響應式設計，支援各種裝置"
echo "  • 美觀的載入動畫和漸層背景"
echo ""

echo -e "${GREEN}✅ 測試完成${NC}" 