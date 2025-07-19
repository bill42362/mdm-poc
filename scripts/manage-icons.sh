#!/bin/bash

# MDM POC 圖示管理腳本
# 用於管理 WebClip Profile 的圖示檔案

ICONS_DIR="src/assets/icons"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 顯示幫助訊息
show_help() {
    echo "🎨 MDM POC 圖示管理工具"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  list                   列出所有圖示"
    echo "  add <檔案> [名稱]      新增圖示檔案"
    echo "  remove <名稱>          移除圖示"
    echo "  resize <檔案>          調整圖示尺寸"
    echo "  optimize <檔案>        優化圖示檔案"
    echo "  backup                 備份所有圖示"
    echo "  restore <備份檔案>     還原備份"
    echo "  help                   顯示此幫助訊息"
    echo ""
    echo "範例:"
    echo "  $0 list"
    echo "  $0 add my-icon.png app-icon"
    echo "  $0 resize large-icon.png"
    echo "  $0 optimize app-icon.png"
}

# 檢查目錄是否存在
check_directory() {
    if [ ! -d "$ICONS_DIR" ]; then
        echo -e "${RED}❌ 圖示目錄不存在: $ICONS_DIR${NC}"
        exit 1
    fi
}

# 列出所有圖示
list_icons() {
    echo -e "${BLUE}📋 圖示列表:${NC}"
    echo ""

    if [ -z "$(ls -A $ICONS_DIR/*.png 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠️  沒有找到 PNG 圖示檔案${NC}"
        return
    fi

    for icon in $ICONS_DIR/*.png; do
        if [ -f "$icon" ]; then
            filename=$(basename "$icon")
            size=$(stat -f%z "$icon" 2>/dev/null || stat -c%s "$icon" 2>/dev/null)
            size_kb=$((size / 1024))
            echo -e "  📱 ${GREEN}$filename${NC} (${size_kb}KB)"
        fi
    done
}

# 新增圖示
add_icon() {
    local source_file="$1"
    local icon_name="$2"

    if [ -z "$source_file" ]; then
        echo -e "${RED}❌ 請指定來源檔案${NC}"
        return 1
    fi

    if [ ! -f "$source_file" ]; then
        echo -e "${RED}❌ 來源檔案不存在: $source_file${NC}"
        return 1
    fi

    # 如果沒有指定名稱，使用檔案名稱（不含副檔名）
    if [ -z "$icon_name" ]; then
        icon_name=$(basename "$source_file" | sed 's/\.[^.]*$//')
    fi

    local target_file="$ICONS_DIR/$icon_name.png"

    echo -e "${BLUE}📥 新增圖示: $icon_name${NC}"

    # 複製檔案
    cp "$source_file" "$target_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 圖示已新增: $target_file${NC}"

        # 顯示檔案資訊
        size=$(stat -f%z "$target_file" 2>/dev/null || stat -c%s "$target_file" 2>/dev/null)
        size_kb=$((size / 1024))
        echo -e "  📊 檔案大小: ${size_kb}KB"
    else
        echo -e "${RED}❌ 新增圖示失敗${NC}"
        return 1
    fi
}

# 移除圖示
remove_icon() {
    local icon_name="$1"

    if [ -z "$icon_name" ]; then
        echo -e "${RED}❌ 請指定要移除的圖示名稱${NC}"
        return 1
    fi

    local icon_file="$ICONS_DIR/$icon_name.png"

    if [ ! -f "$icon_file" ]; then
        echo -e "${RED}❌ 圖示不存在: $icon_name${NC}"
        return 1
    fi

    echo -e "${YELLOW}🗑️  移除圖示: $icon_name${NC}"
    rm "$icon_file"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 圖示已移除${NC}"
    else
        echo -e "${RED}❌ 移除圖示失敗${NC}"
        return 1
    fi
}

# 調整圖示尺寸
resize_icon() {
    local icon_file="$1"

    if [ -z "$icon_file" ]; then
        echo -e "${RED}❌ 請指定圖示檔案${NC}"
        return 1
    fi

    if [ ! -f "$icon_file" ]; then
        echo -e "${RED}❌ 檔案不存在: $icon_file${NC}"
        return 1
    fi

    echo -e "${BLUE}📏 調整圖示尺寸: $icon_file${NC}"

    # 檢查是否有 ImageMagick
    if command -v convert >/dev/null 2>&1; then
        convert "$icon_file" -resize 180x180 "$icon_file"
        echo -e "${GREEN}✅ 圖示尺寸已調整為 180x180${NC}"
    elif command -v sips >/dev/null 2>&1; then
        sips -z 180 180 "$icon_file"
        echo -e "${GREEN}✅ 圖示尺寸已調整為 180x180${NC}"
    else
        echo -e "${YELLOW}⚠️  未找到圖片處理工具，請手動調整尺寸${NC}"
        echo "  建議使用 ImageMagick 或 macOS 的 sips 工具"
    fi
}

# 優化圖示檔案
optimize_icon() {
    local icon_file="$1"

    if [ -z "$icon_file" ]; then
        echo -e "${RED}❌ 請指定圖示檔案${NC}"
        return 1
    fi

    if [ ! -f "$icon_file" ]; then
        echo -e "${RED}❌ 檔案不存在: $icon_file${NC}"
        return 1
    fi

    echo -e "${BLUE}⚡ 優化圖示檔案: $icon_file${NC}"

    # 檢查是否有 pngquant
    if command -v pngquant >/dev/null 2>&1; then
        pngquant --quality=65-80 --force "$icon_file"
        echo -e "${GREEN}✅ 圖示檔案已優化${NC}"
    else
        echo -e "${YELLOW}⚠️  未找到 pngquant，請手動優化檔案${NC}"
        echo "  建議安裝 pngquant 來壓縮 PNG 檔案"
    fi
}

# 備份圖示
backup_icons() {
    local backup_dir="backups/icons_$(date +%Y%m%d_%H%M%S)"

    echo -e "${BLUE}💾 備份圖示檔案${NC}"

    mkdir -p "$backup_dir"
    cp -r "$ICONS_DIR"/* "$backup_dir/"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 圖示已備份到: $backup_dir${NC}"
    else
        echo -e "${RED}❌ 備份失敗${NC}"
        return 1
    fi
}

# 還原備份
restore_backup() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ 請指定備份檔案${NC}"
        return 1
    fi

    if [ ! -d "$backup_file" ]; then
        echo -e "${RED}❌ 備份目錄不存在: $backup_file${NC}"
        return 1
    fi

    echo -e "${YELLOW}🔄 還原圖示備份${NC}"

    cp -r "$backup_file"/* "$ICONS_DIR/"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 圖示已還原${NC}"
    else
        echo -e "${RED}❌ 還原失敗${NC}"
        return 1
    fi
}

# 主程式
main() {
    check_directory

    case "$1" in
        "list")
            list_icons
            ;;
        "add")
            add_icon "$2" "$3"
            ;;
        "remove")
            remove_icon "$2"
            ;;
        "resize")
            resize_icon "$2"
            ;;
        "optimize")
            optimize_icon "$2"
            ;;
        "backup")
            backup_icons
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ 未知選項: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 執行主程式
main "$@"
