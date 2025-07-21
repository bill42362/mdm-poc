#!/bin/bash

# MDM Generator Test Script
echo "🧪 Testing MDM Generator..."

# Check if server is running
if ! curl -s http://localhost:3001/mdm/status > /dev/null; then
    echo "❌ Server is not running. Please start the server first:"
    echo "   npm start"
    exit 1
fi

echo "✅ Server is running"

# Test if the MDM generator page is accessible
if curl -s http://localhost:3001/mdm/generator | grep -q "MDM 配置生成器"; then
    echo "✅ MDM Generator page is accessible"
else
    echo "❌ MDM Generator page is not accessible"
    exit 1
fi

# Test if the JavaScript file is accessible
if curl -s http://localhost:3001/assets/js/mdm-generator.js | grep -q "generateMDM"; then
    echo "✅ MDM Generator JavaScript is present"
else
    echo "❌ MDM Generator JavaScript is missing"
    exit 1
fi

# Test if the page contains the external JavaScript reference
if curl -s http://localhost:3001/mdm/generator | grep -q "mdm-generator.js"; then
    echo "✅ External JavaScript reference is present"
else
    echo "❌ External JavaScript reference is missing"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your MDM generator is working correctly."
echo ""
echo "📱 You can now access the MDM generator at:"
echo "   http://localhost:3001/mdm/generator" 