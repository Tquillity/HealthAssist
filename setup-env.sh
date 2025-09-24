#!/bin/bash

echo "🔧 Setting up environment files..."

# Create server .env file
echo "Creating server environment file..."
cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/HA

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL for CORS
CLIENT_URL=http://localhost:3000
EOF

# Create client .env file
echo "Creating client environment file..."
cat > client/.env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# PWA Configuration
GENERATE_SOURCEMAP=false
PUBLIC_URL=.
EOF

echo "✅ Environment files created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure MongoDB is running locally or update MONGODB_URI in server/.env"
echo "2. Run 'npm run dev' in either client/ or server/ directory"
echo "3. Or run both: cd server && npm run dev & cd ../client && npm run dev"
