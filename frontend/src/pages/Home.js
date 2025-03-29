import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [todayStudyTime, setTodayStudyTime] = useState(0); // in minutes
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    // Load today's study time from localStorage
    const today = new Date().toDateString();
    const studyTimeKey = `studyTime_${currentUser}_${today}`;
    const savedTime = localStorage.getItem(studyTimeKey) || '0';
    setTodayStudyTime(parseInt(savedTime));
  }, [currentUser]);

  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins} minutes`;
    }
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Today's Progress */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Today's Progress</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Study Time</p>
                <p className="text-4xl font-bold text-orange-500">{formatStudyTime(todayStudyTime)}</p>
              </div>
              <div className="h-20 w-20 bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Mode Button */}
        <button
          onClick={() => navigate('/focus')}
          className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Start Focus Mode</h2>
              <p className="text-gray-500 mt-1">Configure your focus environment and start studying</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => navigate('/chatbot')}
          className="w-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Need Help?</h2>
              <p className="text-gray-500 mt-1">Chat with our AI Assistant for study tips and support</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </button>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
            <div className="text-center">
              <p className="text-gray-500">Study Streak</p>
              <p className="text-2xl font-bold text-orange-500">3 days</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
            <div className="text-center">
              <p className="text-gray-500">Focus Score</p>
              <p className="text-2xl font-bold text-orange-500">85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 