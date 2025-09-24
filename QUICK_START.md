# 🚀 Quick Start Guide

## ✅ Setup Complete!

Your HealthAssist is ready to run with the new Turborepo-powered workflow!

## 🎯 How to Run

### Option 1: Run Both (Recommended)
```bash
# From the root HA/ directory, starts both client and server
pnpm dev
```
- **Server:** http://localhost:5000
- **Client:** http://localhost:3000

### Option 2: Run Server Only
```bash
cd server
pnpm dev
```
**Server will run on:** http://localhost:5000

### Option 3: Run Client Only
```bash
cd client
pnpm dev
```
**Client will run on:** http://localhost:3000

## 🔧 What's Configured

### Server (`/server`)
- ✅ TypeScript with hot reload (nodemon)
- ✅ MongoDB connection configured
- ✅ JWT authentication ready
- ✅ All API endpoints implemented
- ✅ Database seeding script available

### Client (`/client`)
- ✅ React with TypeScript
- ✅ Tailwind CSS styling
- ✅ PWA configuration
- ✅ Authentication system
- ✅ Routine lottery feature
- ✅ Responsive design

## 📋 Available Commands

### Root Commands (from HA/ directory)
```bash
pnpm dev         # Start both client and server
pnpm build       # Build both projects
pnpm start       # Start production server
pnpm seed        # Seed database with sample data
pnpm lint        # Run linting on both projects
pnpm clean       # Clean all node_modules and build artifacts
```

### Individual Project Commands
```bash
# Server only
cd server && pnpm dev      # Start development server
cd server && pnpm build    # Build TypeScript
cd server && pnpm start    # Start production server

# Client only
cd client && pnpm dev      # Start development server
cd client && pnpm build    # Build for production
```

## 🗄️ Database Setup

The server is configured to connect to MongoDB at `mongodb://localhost:27017/HA`.

### To seed with sample data:
```bash
pnpm seed
```

This will create sample routines and recipes for testing.

## 🌐 Access Your App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🎲 Test the Todo-Lottery

1. Run `pnpm dev` to start both servers
2. Open http://localhost:3000
3. Register a new account
4. Go to "Routines" page
5. Click "Try Lottery" to test the random routine selection

## 📱 PWA Features

The app is configured as a Progressive Web App:
- Installable on mobile devices
- Offline capability
- App-like experience

## 🆘 Troubleshooting

### Port Already in Use
- Change PORT in `server/.env`
- Or kill the process: `lsof -ti:5000 | xargs kill`

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Or update `MONGODB_URI` in `server/.env` for MongoDB Atlas

### CORS Errors
- Check `CLIENT_URL` in `server/.env`
- Ensure frontend is running on port 3000

## 🎉 You're Ready!

Your HealthAssist is fully configured with Turborepo and ready for development. The todo-lottery system, meal planning, and all core features are implemented and ready to use!

**New Turborepo Benefits:**
- ⚡ Faster builds with intelligent caching
- 🔄 Parallel task execution
- 📦 Monorepo management
- 🚀 Single command development (`pnpm dev`)
