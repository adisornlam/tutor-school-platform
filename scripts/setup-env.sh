#!/bin/bash

# Setup .env file from .env.example
# Usage: ./scripts/setup-env.sh

if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi

cp .env.example .env
echo "✅ .env file created from .env.example"
echo ""
echo "📝 Please review and update .env file if needed:"
echo "   - Database credentials"
echo "   - JWT secrets (already generated)"
echo ""

