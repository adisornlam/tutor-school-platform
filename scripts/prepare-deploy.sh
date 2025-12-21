#!/bin/bash

# Script to prepare deployment files for cPanel
# This script creates a zip file of the .output directory

set -e

echo "📦 Preparing deployment package..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .output directory exists
if [ ! -d ".output" ]; then
    echo "❌ Error: .output directory not found. Please run 'bun run build' first."
    exit 1
fi

# Create deployment package
DEPLOY_DIR="deploy"
DEPLOY_ZIP="deploy-output.zip"

# Clean up old deployment files
rm -rf "$DEPLOY_DIR" "$DEPLOY_ZIP"

echo "${BLUE}📁 Creating deployment package...${NC}"

# Create zip file of .output directory
zip -r "$DEPLOY_ZIP" .output/

echo "${GREEN}✅ Deployment package created: $DEPLOY_ZIP${NC}"
echo ""
echo "📋 Deployment Instructions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Upload $DEPLOY_ZIP to your server"
echo "   Location: /home/username/kdcschool.webthdesign.com/"
echo ""
echo "2. SSH into your server and extract:"
echo "   cd /home/username/kdcschool.webthdesign.com/"
echo "   unzip deploy-output.zip"
echo ""
echo "3. The structure will be:"
echo "   /home/username/kdcschool.webthdesign.com/.output/"
echo "   ├── public/"
echo "   ├── server/"
echo "   │   ├── index.mjs  ← Startup file for cPanel"
echo "   │   └── package.json"
echo "   └── shared/"
echo ""
echo "4. In cPanel Node.js Application settings:"
echo "   - Application root: /home/username/kdcschool.webthdesign.com"
echo "   - Startup file: .output/server/index.mjs"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Package size:"
ls -lh "$DEPLOY_ZIP" | awk '{print "   " $5}'

