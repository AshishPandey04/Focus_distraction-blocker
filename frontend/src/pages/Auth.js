import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setIsAuthenticated }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password || (!isSignIn && (!formData.username || !formData.confirmPassword))) {
      setError('Please fill in all fields');
      return;
    }

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Store user data in localStorage (in a real app, this would be an API call)
      if (isSignIn) {
        // Check if user exists
        const storedUser = localStorage.getItem(formData.email);
        if (!storedUser || JSON.parse(storedUser).password !== formData.password) {
          setError('Invalid email or password');
          return;
        }
      } else {
        // Check if user already exists
        if (localStorage.getItem(formData.email)) {
          setError('Email already exists');
          return;
        }
        // Store new user
        localStorage.setItem(formData.email, JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }));
      }

      // Set authentication
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', formData.email);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg transform rotate-45 relative">
          <div className="absolute inset-0 flex items-center justify-center -rotate-45">
            <div className="w-8 h-8 bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-2xl text-white text-center mb-12">
        Study, don't do it alone, do it with others!
      </h1>

      {/* Auth Form */}
      <div className="w-full max-w-sm">
        <div className="bg-[#1A1A1A] p-6 rounded-lg w-full">
          <h2 className="text-2xl text-white mb-6">{isSignIn ? 'Sign In' : 'Create Account'}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isSignIn && (
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {!isSignIn && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isSignIn ? 'Sign In' : 'Create Account'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={toggleForm}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-4">
        <p className="text-gray-500 text-sm">Focus+ Blocker</p>
      </div>
    </div>
  );
};

export default Auth; 