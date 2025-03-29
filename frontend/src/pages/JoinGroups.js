import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinGroups = () => {
  const [availableGroups, setAvailableGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = localStorage.getItem('currentUser');
  const navigate = useNavigate();

  useEffect(() => {
    // Load all groups from localStorage
    const loadGroups = () => {
      const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      // Filter out groups user is already a member of
      const available = allGroups.filter(group => !group.members.includes(currentUser));
      setAvailableGroups(available);
    };
    loadGroups();
  }, [currentUser]);

  const handleJoinGroup = (groupId) => {
    // Get all groups
    const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    
    // Update the specific group
    const updatedGroups = allGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: [...group.members, currentUser]
        };
      }
      return group;
    });

    // Save back to localStorage
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    // Navigate to groups page
    navigate('/groups');
  };

  // Filter groups based on search term
  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Study Groups</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Created by: {group.creator}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'No groups found matching your search.'
                : 'No available groups to join at the moment.'}
            </p>
            <button
              onClick={() => navigate('/groups')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Create Your Own Group →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGroups; 