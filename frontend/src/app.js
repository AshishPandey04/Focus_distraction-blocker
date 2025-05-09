import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Groups from './pages/Groups';
import JoinGroups from './pages/JoinGroups';
import Chatbot from './pages/Chatbot';
import FocusMode from './pages/FocusMode';
import BlockSites from './pages/BlockSites';
import BlockApps from './pages/BlockApps';
import StudyTime from './pages/StudyTime';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={isAuthenticated() ? <Navigate to="/home" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated() ? <Navigate to="/home" replace /> : <Register />} 
            />

            {/* Protected routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/groups" 
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/block-apps" 
              element={
                <ProtectedRoute>
                  <BlockApps />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/join-groups" 
              element={
                <ProtectedRoute>
                  <JoinGroups />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/block-site" 
              element={
                <ProtectedRoute>
                  <BlockSites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/focus-mode" 
              element={
                <ProtectedRoute>
                  <FocusMode />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/block-sites" 
              element={
                <ProtectedRoute>
                  <BlockSites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/study-time" 
              element={
                <ProtectedRoute>
                  <StudyTime />
                </ProtectedRoute>
              } 
            />
          

            {/* Catch all other routes and redirect */}
            <Route 
              path="*" 
              element={
                isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
