#!/bin/bash

# MDM POC 圖示功能測試腳本

BASE_URL="http://localhost:3001"
ICONS_DIR="src/assets/icons"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 MDM POC 圖示功能測試${NC}"
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

# 測試 1: 使用預設圖示
echo -e "${BLUE}📱 測試 1: 使用預設圖示${NC}"
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com" > test-default.mobileconfig
if grep -q "Icon" test-default.mobileconfig; then
    echo -e "${GREEN}✅ 預設圖示測試通過${NC}"
else
    echo -e "${RED}❌ 預設圖示測試失敗${NC}"
fi

# 測試 2: 使用指定圖示
echo -e "${BLUE}📱 測試 2: 使用指定圖示 (swag-apple-icon.png)${NC}"
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com&webClipIcon=swag-apple-icon.png" > test-custom.mobileconfig
if grep -q "Icon" test-custom.mobileconfig; then
    echo -e "${GREEN}✅ 指定圖示測試通過${NC}"
else
    echo -e "${RED}❌ 指定圖示測試失敗${NC}"
fi

# 測試 3: 使用不存在的圖示
echo -e "${BLUE}📱 測試 3: 使用不存在的圖示${NC}"
curl -s "$BASE_URL/mdm/webclip?webClipName=Test%20App&webClipURL=https://example.com&webClipIcon=non-existent.png" > test-invalid.mobileconfig
if grep -q "<data></data>" test-invalid.mobileconfig; then
    echo -e "${GREEN}✅ 無效圖示處理測試通過${NC}"
else
    echo -e "${RED}❌ 無效圖示處理測試失敗${NC}"
fi

echo ""

# 檢查圖示檔案
echo -e "${BLUE}📋 檢查圖示檔案${NC}"
if [ -f "$ICONS_DIR/swag-apple-icon.png" ]; then
    size=$(stat -f%z "$ICONS_DIR/swag-apple-icon.png" 2>/dev/null || stat -c%s "$ICONS_DIR/swag-apple-icon.png" 2>/dev/null)
    size_kb=$((size / 1024))
    echo -e "${GREEN}✅ 找到預設圖示: swag-apple-icon.png (${size_kb}KB)${NC}"
else
    echo -e "${YELLOW}⚠️  預設圖示檔案不存在${NC}"
fi

echo ""

# 比較檔案大小
echo -e "${BLUE}📊 檔案大小比較${NC}"
if [ -f "test-default.mobileconfig" ] && [ -f "test-custom.mobileconfig" ]; then
    default_size=$(stat -f%z "test-default.mobileconfig" 2>/dev/null || stat -c%s "test-default.mobileconfig" 2>/dev/null)
    custom_size=$(stat -f%z "test-custom.mobileconfig" 2>/dev/null || stat -c%s "test-custom.mobileconfig" 2>/dev/null)

    echo -e "預設圖示 Profile: ${default_size} bytes"
    echo -e "自訂圖示 Profile: ${custom_size} bytes"

    if [ "$default_size" -eq "$custom_size" ]; then
        echo -e "${GREEN}✅ 檔案大小一致${NC}"
    else
        echo -e "${YELLOW}⚠️  檔案大小不同 (預期行為)${NC}"
    fi
fi

echo ""

# 清理測試檔案
echo -e "${BLUE}🧹 清理測試檔案${NC}"
rm -f test-*.mobileconfig
echo -e "${GREEN}✅ 測試完成${NC}"

echo ""
echo -e "${BLUE}💡 使用範例:${NC}"
echo "  # 使用預設圖示"
echo "  curl \"$BASE_URL/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com\" -o app.mobileconfig"
echo ""
echo "  # 使用自訂圖示"
echo "  curl \"$BASE_URL/mdm/webclip?webClipName=My%20App&webClipURL=https://myapp.com&webClipIcon=my-icon.png\" -o app.mobileconfig"
