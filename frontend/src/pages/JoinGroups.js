import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function JoinGroups() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchGroups(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchGroups = async (search) => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedGroups = await groupService.getAvailableGroups(search);
      setGroups(fetchedGroups);
    } catch (err) {
      setError('Failed to fetch groups. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      setIsLoading(true);
      setError('');
      await groupService.joinGroup(groupId);
      setSuccessMessage('Successfully joined the group!');
      
      // Remove the joined group from the list
      setGroups(groups.filter(group => group._id !== groupId));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Join Study Groups</h1>
        
        {/* Search Bar */}
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                {searchTerm 
                  ? 'No groups found matching your search.' 
                  : 'No available groups to join at the moment.'}
              </p>
              <button
                onClick={() => navigate('/groups')}
                className="mt-4 text-orange-500 hover:text-orange-600"
              >
                Create your own group
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                {group.description && (
                  <p className="text-gray-600 mb-4">{group.description}</p>
                )}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Created by: {group.creator.username || group.creator.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Members: {group.members.length}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Created: {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JoinGroups; 