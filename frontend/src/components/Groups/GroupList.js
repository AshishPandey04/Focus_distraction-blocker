import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/groupService';
import LoadingSpinner from '../common/LoadingSpinner';

function GroupList({ onError }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getMyGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error fetching groups:', err);
      onError(err.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Groups</h2>
      {groups.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          You haven't joined any groups yet.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-lg">{group.name}</h3>
              <p className="text-sm text-gray-500">
                Members: {group.members?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupList; 