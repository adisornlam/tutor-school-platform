#!/bin/bash

# Setup Redis for local development

echo "🔧 Setting up Redis for local development..."
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install Homebrew first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Check if Redis is already installed
if command -v redis-server &> /dev/null; then
    echo "✅ Redis is already installed"
    redis-server --version
else
    echo "📦 Installing Redis..."
    brew install redis
fi

echo ""
echo "🚀 Starting Redis server..."
echo ""

# Check if Redis is running
if redis-cli ping &> /dev/null; then
    echo "✅ Redis is already running"
else
    # Start Redis using brew services (runs in background)
    echo "Starting Redis as a background service..."
    brew services start redis
    
    # Wait a moment for Redis to start
    sleep 2
    
    # Test connection
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis started successfully"
    else
        echo "⚠️  Redis may not be running. Try: brew services start redis"
    fi
fi

echo ""
echo "📋 Redis Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Host: localhost"
echo "  Port: 6379 (default)"
echo "  Status: $(redis-cli ping 2>/dev/null || echo 'Not running')"
echo ""
echo "📝 Useful commands:"
echo "  Start Redis:     brew services start redis"
echo "  Stop Redis:      brew services stop redis"
echo "  Restart Redis:   brew services restart redis"
echo "  Check status:    brew services list | grep redis"
echo "  Test connection: redis-cli ping"
echo "  Redis CLI:       redis-cli"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Redis setup complete!"
echo ""
echo "💡 Note: Make sure your .env file has these Redis settings:"
echo "   REDIS_HOST=localhost"
echo "   REDIS_PORT=6379"
echo "   REDIS_PASSWORD="
echo "   REDIS_DB=0"

