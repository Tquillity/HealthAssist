import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Routines from './pages/Routines';
import Recipes from './pages/Recipes';
import MealPlanner from './pages/MealPlanner';
import Journal from './pages/Journal';
import Educational from './pages/Educational';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/routines" 
                element={
                  <ProtectedRoute>
                    <Routines />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recipes" 
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meal-planner" 
                element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/journal" 
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/educational" 
                element={
                  <ProtectedRoute>
                    <Educational />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <PWAInstallPrompt />
          <OfflineIndicator />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
