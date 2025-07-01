#!/bin/bash
# Render deployment debug script

echo "=== Current directory ==="
pwd
echo "=== Listing files ==="
ls -la
echo "=== Checking if backend exists ==="
if [ -d "backend" ]; then
    echo "✅ backend directory found"
    ls -la backend/
    echo "=== Installing dependencies ==="
    cd backend && npm install
else
    echo "❌ backend directory not found"
    echo "Available directories:"
    find . -type d -name "*backend*"
fi
