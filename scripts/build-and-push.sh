#!/bin/bash

# Docker 映像建立和推送腳本
# 使用方式: ./scripts/build-and-push.sh [registry] [image-name] [tag]

set -e

# 預設值
REGISTRY=${1:-"registry.digitalocean.com"}
IMAGE_NAME=${2:-"your-registry/ios-mdm-profile-generator"}
TAG=${3:-"latest"}

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 開始建立 Docker 映像...${NC}"
echo -e "${YELLOW}Registry: ${REGISTRY}${NC}"
echo -e "${YELLOW}Image: ${IMAGE_NAME}${NC}"
echo -e "${YELLOW}Tag: ${TAG}${NC}"

# 建立 Docker 映像
echo -e "${GREEN}📦 建立 Docker 映像...${NC}"
docker build -t ${IMAGE_NAME}:${TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker 映像建立成功！${NC}"
else
    echo -e "${RED}❌ Docker 映像建立失敗！${NC}"
    exit 1
fi

# 標記映像
echo -e "${GREEN}🏷️  標記映像...${NC}"
docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG}

# 推送映像
echo -e "${GREEN}📤 推送映像到 ${REGISTRY}...${NC}"
docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 映像推送成功！${NC}"
    echo -e "${GREEN}🎉 完成！映像位置: ${REGISTRY}/${IMAGE_NAME}:${TAG}${NC}"
else
    echo -e "${RED}❌ 映像推送失敗！${NC}"
    exit 1
fi 