import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { studySessionService } from '../services/studySessionService';
import { blockSiteService } from '../services/blockSiteService';

function FocusMode() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [error, setError] = useState(null);
  const [blockedSites, setBlockedSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch blocked sites when component mounts
  useEffect(() => {
    const fetchBlockedSites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/blocked-apps');
        if (!response.ok) throw new Error('Failed to fetch blocked apps');
        const data = await response.json();
        setBlockedSites(data);
      } catch (err) {
        setError('Failed to load blocked applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedSites();
  }, []);

  const handleEndSession = useCallback(() => {
    if (currentSession) {
      // Handle session end logic
      setCurrentSession(null);
      setIsActive(false);
    }
  }, [currentSession]);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleEndSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (currentSession) {
        handleEndSession();
      }
    };
  }, [isActive, time, currentSession, handleEndSession]);

  const handleStartSession = async () => {
    try {
      const session = await studySessionService.startSession();
      setCurrentSession(session);
      setIsActive(true);
      setError('');
    } catch (err) {
      setError('Failed to start session. Please try again.');
      console.error('Error starting session:', err);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const toggleTimer = () => {
    if (!isActive && !currentSession) {
      handleStartSession();
    } else {
      setIsActive(!isActive);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const resetTimer = async () => {
    if (currentSession) {
      await handleEndSession();
    }
    setIsActive(false);
    setTime(25 * 60);
    setError('');
  };

  const handleBlockWebsites = () => {
    navigate('/block-site');
  };

  const handleBlockApps = () => {
    navigate('/block-apps');
  };

  const handleStartFocus = () => {
    navigate('/study-time');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
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

          {/* Block Apps Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
               onClick={handleBlockApps}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Block Apps</h2>
                <p className="text-gray-500 mt-1">Specify which applications to block during focus time</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
               onClick={handleStartFocus}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Start Focus Study</h2>
                
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>


        
        </>
      )}
    </div>
  );
}

export default FocusMode; 