import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    // Load user's groups from localStorage
    const loadGroups = () => {
      const allGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const userGroups = allGroups.filter(
        group => group.members.includes(currentUser) || group.creator === currentUser
      );
      setMyGroups(userGroups);
    };
    loadGroups();
  }, [currentUser]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    // Get existing groups or initialize empty array
    const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    
    // Create new group
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      creator: currentUser,
      members: [currentUser],
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('groups', JSON.stringify([...existingGroups, newGroup]));
    
    // Update state
    setMyGroups([...myGroups, newGroup]);
    
    // Reset form
    setGroupName('');
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create New Group
          </button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map(group => (
            <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Created by: {group.creator === currentUser ? 'You' : group.creator}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => navigate(`/group/${group.id}`)}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    View Group →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Group</h2>
              <form onSubmit={handleCreateGroup}>
                <div className="mb-4">
                  <label htmlFor="groupName" className="block text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter group name"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State */}
        {myGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
            <button
              onClick={() => navigate('/join-groups')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Browse Available Groups →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups; 