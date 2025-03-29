import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { studySessionService } from '../services/studySessionService';

const FocusMode = () => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (currentSession) {
        handleEndSession();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStartSession = async () => {
    try {
      const session = await studySessionService.startSession();
      setCurrentSession(session);
      setIsActive(true);
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleEndSession = async () => {
    if (currentSession) {
      try {
        await studySessionService.endSession(currentSession._id);
        setCurrentSession(null);
      } catch (err) {
        console.error('Failed to end session:', err);
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && !currentSession) {
      handleStartSession();
    } else {
      setIsActive(!isActive);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    if (currentSession) {
      handleEndSession();
    }
  };

  const handleBlockWebsites = () => {
    if (window.chrome && window.chrome.runtime) {
      // Instead of opening the popup directly, trigger the extension's action
      window.chrome.runtime.sendMessage('ehleajoonjkjfiiijdljilnclommopcc', 
        { action: "openSettings" }, 
        function(response) {
          if (window.chrome.runtime.lastError) {
            alert('Please make sure the extension is enabled and try refreshing the page.');
          }
        }
      );
    } else {
      alert('Please use Google Chrome to access this feature.');
    }
  };

  const handleAllowedApps = () => {
    // This will be implemented later
    alert('This feature will be available soon!');
  };

  const handleStartFocus = () => {
    navigate('/study-time');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Focus Mode Setup</h1>
          <p className="mt-2 text-gray-600">Configure your focus environment before starting</p>
        </div>

        <div className="space-y-6">
          {/* Block Websites Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
               onClick={handleBlockWebsites}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Block Distracting Websites</h2>
                <p className="text-gray-500 mt-1">Configure which websites to block during focus time</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Allowed Apps Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
               onClick={handleAllowedApps}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Allowed Apps</h2>
                <p className="text-gray-500 mt-1">Specify which applications are allowed during focus time</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Focus Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
               onClick={handleStartFocus}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Start Focus Session</h2>
                <p className="text-gray-500 mt-1">Begin your focused study time with the timer</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode; 