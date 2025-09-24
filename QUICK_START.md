# 🚀 Quick Start Guide

## ✅ Setup Complete!

Your Health and Wellness Hub is ready to run. You can now start the client and server separately using `npm run dev` in their respective folders.

## 🎯 How to Run

### Option 1: Run Server Only
```bash
cd server
npm run dev
```
**Server will run on:** http://localhost:5000

### Option 2: Run Client Only
```bash
cd client
npm run dev
```
**Client will run on:** http://localhost:3000

### Option 3: Run Both (Recommended)
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

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

### Server Commands
```bash
cd server
npm run dev      # Start development server
npm run build    # Build TypeScript
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

### Client Commands
```bash
cd client
npm run dev      # Start development server
npm start        # Same as dev
npm run build    # Build for production
npm test         # Run tests
```

## 🗄️ Database Setup

The server is configured to connect to MongoDB at `mongodb://localhost:27017/HA`.

### To seed with sample data:
```bash
cd server
npm run seed
```

This will create sample routines and recipes for testing.

## 🌐 Access Your App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🎲 Test the Todo-Lottery

1. Start both servers
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

Your Health and Wellness Hub is fully configured and ready for development. The todo-lottery system, meal planning, and all core features are implemented and ready to use!
