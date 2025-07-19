#!/bin/bash

# MDM POC WebClip HTML 功能測試腳本

BASE_URL="http://localhost:3001"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 MDM POC WebClip HTML 功能測試${NC}"
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

# 測試 1: 預設 HTML (使用本地 index.html)
echo -e "${BLUE}📄 測試 1: 預設 HTML (使用本地 index.html)${NC}"
if curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App" | grep -q "data:text/html;base64"; then
    echo -e "${GREEN}✅ 預設 HTML base64 編碼正常${NC}"
else
    echo -e "${RED}❌ 預設 HTML base64 編碼異常${NC}"
fi

# 測試 2: 指定外部 URL
echo -e "${BLUE}📄 測試 2: 指定外部 URL${NC}"
if curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com" | grep -q "https://example.com"; then
    echo -e "${GREEN}✅ 外部 URL 處理正常${NC}"
else
    echo -e "${RED}❌ 外部 URL 處理異常${NC}"
fi

# 測試 3: 指定本地 HTML 檔案
echo -e "${BLUE}📄 測試 3: 指定本地 HTML 檔案${NC}"
if curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=index.html" | grep -q "data:text/html;base64"; then
    echo -e "${GREEN}✅ 本地 HTML 檔案處理正常${NC}"
else
    echo -e "${RED}❌ 本地 HTML 檔案處理異常${NC}"
fi

# 測試 4: 不存在的 HTML 檔案
echo -e "${BLUE}📄 測試 4: 不存在的 HTML 檔案${NC}"
if curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=non-existent.html" | grep -q "data:text/html;base64"; then
    echo -e "${GREEN}✅ 不存在的檔案回退到預設 HTML${NC}"
else
    echo -e "${RED}❌ 不存在的檔案處理異常${NC}"
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

# 比較不同 URL 類型的檔案大小
echo -e "${BLUE}📊 檔案大小比較${NC}"

# 生成測試檔案
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App" > test-default.mobileconfig
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com" > test-external.mobileconfig
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=index.html" > test-local.mobileconfig

if [ -f "test-default.mobileconfig" ] && [ -f "test-external.mobileconfig" ] && [ -f "test-local.mobileconfig" ]; then
    default_size=$(stat -f%z "test-default.mobileconfig" 2>/dev/null || stat -c%s "test-default.mobileconfig" 2>/dev/null)
    external_size=$(stat -f%z "test-external.mobileconfig" 2>/dev/null || stat -c%s "test-external.mobileconfig" 2>/dev/null)
    local_size=$(stat -f%z "test-local.mobileconfig" 2>/dev/null || stat -c%s "test-local.mobileconfig" 2>/dev/null)
    
    echo -e "預設 HTML Profile: ${default_size} bytes"
    echo -e "外部 URL Profile: ${external_size} bytes"
    echo -e "本地 HTML Profile: ${local_size} bytes"
    
    if [ "$default_size" -eq "$local_size" ]; then
        echo -e "${GREEN}✅ 預設和本地 HTML 檔案大小一致${NC}"
    else
        echo -e "${YELLOW}⚠️  檔案大小不同 (預期行為)${NC}"
    fi
    
    if [ "$default_size" -gt "$external_size" ]; then
        echo -e "${GREEN}✅ 預設 HTML 檔案大於外部 URL (包含 base64 資料)${NC}"
    else
        echo -e "${YELLOW}⚠️  檔案大小關係異常${NC}"
    fi
fi

echo ""

# 顯示使用範例
echo -e "${BLUE}💡 使用範例${NC}"
echo "  # 使用預設 HTML (自動轉換為 base64)"
echo "  curl \"$BASE_URL/mdm/webclip?webClipName=My%20App\" -o app.mobileconfig"
echo ""
echo "  # 使用外部 URL"
echo "  curl \"$BASE_URL/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com\" -o app.mobileconfig"
echo ""
echo "  # 使用本地 HTML 檔案 (轉換為 base64)"
echo "  curl \"$BASE_URL/mdm/webclip?webClipName=My%20App&webClipURL=my-page.html\" -o app.mobileconfig"
echo ""

# 清理測試檔案
echo -e "${BLUE}🧹 清理測試檔案${NC}"
rm -f test-*.mobileconfig
echo -e "${GREEN}✅ 測試完成${NC}" 