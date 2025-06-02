#!/bin/bash
# filepath: /home/labber/FreshConnect/backend/seed-db.sh

echo "Seeding FreshConnect database..."
echo "================================"

# Check if .env file exists and required variables are set
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating one with default PostgreSQL connection."
    echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/farm_connect" > .env
    echo "JWT_SECRET=development_secret_key_only" >> .env
    echo "✅ Created .env file with default values"
fi

# Load environment variables
source .env

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env file"
    exit 1
fi

# Check if JWT_SECRET is set
if [ -z "$JWT_SECRET" ]; then
    echo "⚠️ JWT_SECRET not found in .env file. Setting a default value for development"
    echo "JWT_SECRET=development_secret_key_only" >> .env
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Run the seeders
echo "🌱 Running database seeders..."
node seeders/index.js

# Print login credentials for testing
echo ""
echo "================================"
echo "🔐 Test Login Credentials"
echo "================================"
echo "Admin:"
echo "  Email: admin@freshconnect.com"
echo "  Password: password123"
echo ""
echo "Farmers:"
echo "  Email: john@farm.com"
echo "  Password: password123"
echo ""
echo "  Email: maria@organicfarms.com"
echo "  Password: password123"
echo ""
echo "Consumers:"
echo "  Email: alice@example.com"
echo "  Password: password123"
echo ""
echo "  Email: bob@example.com"
echo "  Password: password123"
echo ""
echo "================================"
echo "✅ Database seeding completed!"
echo "🚀 You can now test the full flow of the application"
