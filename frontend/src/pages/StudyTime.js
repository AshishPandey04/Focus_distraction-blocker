import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudyTime = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const currentUser = localStorage.getItem('currentUser');
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroupsAndTimes = () => {
      const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const userGroups = allGroups.filter(group => 
        group.members.includes(currentUser)
      );

      const today = new Date().toDateString();
      const groupsWithTimes = userGroups.map(group => ({
        ...group,
        members: group.members.map(member => ({
          email: member,
          studyTime: parseInt(localStorage.getItem(`studyTime_${member}_${today}`) || '0')
        }))
      }));

      setMyGroups(groupsWithTimes);
    };

    loadGroupsAndTimes();
    const interval = setInterval(loadGroupsAndTimes, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Prevent going back during active session
  useEffect(() => {
    const preventNavigation = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = ''; // This is needed for Chrome
        return 'You have an active study session. Are you sure you want to leave?';
      }
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', () => {
      if (isRunning) {
        window.history.pushState(null, null, window.location.pathname);
      }
    });

    window.addEventListener('beforeunload', preventNavigation);

    return () => {
      window.removeEventListener('beforeunload', preventNavigation);
    };
  }, [isRunning]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (timeLeft === 0) {
      // If timer reached zero, reset to 25 minutes when starting again
      setTimeLeft(25 * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleEndSession = () => {
    if (isRunning) {
      if (window.confirm('Are you sure you want to end your study session?')) {
        setIsRunning(false);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60); // Reset to 25 minutes
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Timer Circle */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            {/* Orange Circle Timer */}
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 rounded-full bg-orange-500"></div>
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-mono font-bold text-gray-800">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="space-x-4">
              <button
                onClick={handleStartPause}
                className={`px-8 py-3 rounded-lg text-white font-medium ${
                  isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-colors`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={handleEndSession}
                className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
              >
                End Session
              </button>
            </div>
            {isRunning && (
              <p className="mt-4 text-red-500 text-sm">
                Don't leave this page during your study session!
              </p>
            )}
          </div>
        </div>

        {/* Group Members */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {myGroups.map(group => (
            <div key={group.id} className="mb-8 last:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
                <span className="text-orange-500 font-medium">
                  {group.members.length} members studying
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {group.members.map(member => (
                  <div 
                    key={member.email}
                    className="bg-gray-50 rounded-xl p-4 flex flex-col items-center"
                  >
                    {/* Member Avatar */}
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-orange-600 font-semibold text-lg">
                        {member.email[0].toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Member Name */}
                    <span className="text-gray-800 font-medium mb-2 text-center">
                      {member.email === currentUser ? 'You' : member.email.split('@')[0]}
                    </span>
                    
                    {/* Study Time */}
                    <span className="text-sm text-gray-500">
                      {formatTime(member.studyTime)}
                    </span>

                    {/* Active Indicator */}
                    <div className="mt-2 flex items-center">
                      <div className={`w-2 h-2 rounded-full ${member.studyTime > 0 ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></div>
                      <span className="text-xs text-gray-500">
                        {member.studyTime > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {myGroups.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Join a study group to see other members here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTime; 