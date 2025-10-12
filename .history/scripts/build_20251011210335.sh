#!/bin/bash

echo "Building Phishing Detection MVP..."

# Build Chrome Extension
echo "Building Chrome Extension..."
cd frontend/chrome-extension
npm run build
cd ../..

echo "Build completed!"
echo ""
echo "To load the Chrome extension:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select: frontend/chrome-extension/dist"