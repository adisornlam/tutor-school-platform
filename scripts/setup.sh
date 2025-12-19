#!/bin/bash

# Complete Setup Script for Tutor School Platform
# Usage: ./scripts/setup.sh

echo "🚀 Setting up Tutor School Platform..."
echo ""

# Step 1: Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
bun install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Step 3: Setup database
read -p "Do you want to setup database now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Setting up database..."
    ./scripts/setup-db.sh
else
    echo "⏭️  Skipping database setup"
    echo "   Run './scripts/setup-db.sh' later to setup database"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Review .env file and update if needed"
echo "   2. Make sure MySQL is running on port 3307"
echo "   3. Run './scripts/setup-db.sh' to setup database (if not done)"
echo "   4. Run 'bun run dev' to start development server"
echo ""

