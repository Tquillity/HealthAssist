# Development Guide

## Quick Start

### 1. Setup Environment
```bash
# Run the setup script to create environment files
./setup-env.sh
```

### 2. Install Dependencies
```bash
# Install all dependencies (client and server)
pnpm install
```

### 3. Start Development Servers

#### Option A: Run Both Servers (Recommended)
```bash
# From the root HA/ directory, starts both client and server
pnpm dev
```

#### Option B: Run Individual Servers
```bash
# Backend only
cd server
pnpm dev

# Frontend only
cd client
pnpm dev
```

## Development URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The default connection string is already configured

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

## Seeding Database

To populate the database with sample data:

```bash
pnpm seed
```

This will create sample routines and recipes for testing.

## Available Scripts

### Root Commands (from HA/ directory)
- `pnpm dev` - Start both client and server in development mode
- `pnpm build` - Build both client and server for production
- `pnpm start` - Start production server
- `pnpm seed` - Seed database with sample data
- `pnpm lint` - Run linting on both projects
- `pnpm clean` - Clean all node_modules and build artifacts

### Individual Project Commands
- `cd server && pnpm dev` - Start server only
- `cd client && pnpm dev` - Start client only

## Project Structure

```
HA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   └── types/        # TypeScript types
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── scripts/      # Database seeding
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change PORT in `server/.env`
   - Or kill the process using the port

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in `server/.env`

3. **CORS errors**
   - Check CLIENT_URL in `server/.env`
   - Ensure frontend is running on the correct port

4. **Build errors**
   - Run `npm install` in both directories
   - Check TypeScript configuration

### Development Tips

- Use `pnpm dev` from the root directory to start both client and server
- The server will restart automatically on file changes
- The client will hot-reload on file changes
- Check browser console for frontend errors
- Check terminal for backend errors
- Turborepo will manage the build cache for faster subsequent builds
