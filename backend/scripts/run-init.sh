#!/bin/bash

# Database Initialization Script for UDM Portal
echo "🚀 Initializing UDM Portal Database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/udm-portal

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_$(date +%s)

# Server Port
PORT=5000

# Environment
NODE_ENV=development
EOF
    echo "✅ .env file created. Please update MONGODB_URI and JWT_SECRET as needed."
fi

# Run the database initialization
echo "📊 Creating database schemas and indexes..."
npm run init-db

echo "✅ Database initialization complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with correct MongoDB URI"
echo "2. Start the server with: npm run dev"
echo "3. The database will be ready for use!"
