import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user data in localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (err) {
        handleLogout();
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Force navigate to login page
    navigate('/login');
    
    // Optional: Reload the page to clear any remaining state
    window.location.reload();
  };

  // Don't show navbar on login or register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Don't show navbar if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <Link 
              to="/home" 
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
            >
              <Logo />
              <span className="font-bold text-xl">Focus+</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/home" 
                className={`px-3 py-2 transition-colors ${
                  location.pathname === '/home' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/groups" 
                className={`px-3 py-2 transition-colors ${
                  location.pathname === '/groups' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                My Groups
              </Link>
              <Link 
                to="/join-groups" 
                className={`px-3 py-2 transition-colors ${
                  location.pathname === '/join-groups' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                Join Groups
              </Link>
            </div>
          </div>

          {/* Right side - User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 