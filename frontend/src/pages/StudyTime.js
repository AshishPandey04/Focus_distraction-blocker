import { useState, useEffect } from 'react';

const StudyTime = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Save completed study session
        const today = new Date().toDateString();
        const studyTimeKey = `studyTime_${currentUser}_${today}`;
        const currentTime = parseInt(localStorage.getItem(studyTimeKey) || '0');
        localStorage.setItem(studyTimeKey, (currentTime + 25).toString()); // Add 25 minutes

        // Switch to break time
        setTimeLeft(5 * 60); // 5 minutes break
        setIsBreak(true);
        // Play notification sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
      } else {
        // Switch back to study time
        setTimeLeft(25 * 60);
        setIsBreak(false);
        // Play notification sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, currentUser]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isBreak ? 'Break Time!' : 'Study Time'}
            </h2>
            <div className="text-6xl font-mono text-orange-500 mb-8">
              {formatTime(timeLeft)}
            </div>
            <div className="space-x-4">
              <button
                onClick={toggleTimer}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-colors`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Session</h3>
            <p className="text-gray-600">
              {isBreak
                ? 'Take a short break! Stretch, walk around, or grab a drink.'
                : 'Focus on your task. Stay concentrated and avoid distractions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTime; 