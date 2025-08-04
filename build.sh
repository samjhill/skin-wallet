#!/bin/bash

# Skin Wallet Web UI Build Script

echo "🎨 Building Skin Wallet Web UI..."

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the skin-wallet root directory"
    exit 1
fi

# Create docs directory if it doesn't exist
if [ ! -d "docs" ]; then
    echo "📁 Creating docs directory..."
    mkdir -p docs
fi

# Copy necessary assets
echo "📋 Copying assets..."
if [ -d "fonts" ]; then
    cp -r fonts docs/
fi

if [ -d "images" ]; then
    cp -r images docs/
fi

if [ -d "styles" ]; then
    cp -r styles docs/
fi

# Test the web interface
echo "🧪 Testing web interface..."
cd docs

# Check if Python is available for testing
if command -v python3 &> /dev/null; then
    echo "🚀 Starting test server..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 2
    
    # Test if the page loads
    if curl -f http://localhost:8000 > /dev/null 2>&1; then
        echo "✅ Web interface is working!"
        echo "🌐 Open http://localhost:8000 in your browser"
        echo "🧪 Test page: http://localhost:8000/test.html"
    else
        echo "❌ Web interface failed to load"
    fi
    
    # Stop the test server
    kill $SERVER_PID 2>/dev/null
else
    echo "⚠️  Python not available for testing"
fi

cd ..

echo "✅ Build complete!"
echo ""
echo "📁 Files created:"
echo "  - docs/index.html (main web interface)"
echo "  - docs/styles.css (styling)"
echo "  - docs/app.js (JavaScript logic)"
echo "  - docs/test.html (test page)"
echo ""
echo "🚀 To deploy to GitHub Pages:"
echo "  1. Push to main branch"
echo "  2. GitHub Actions will auto-deploy"
echo "  3. Visit: https://yourusername.github.io/skin-wallet/"
echo ""
echo "🔧 To test locally:"
echo "  cd docs && python3 -m http.server 8000" 