import React, { useState, useEffect } from 'react';
import { groupService } from '../services/groupService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedGroups = await groupService.getMyGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      setError('Failed to fetch groups. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const createdGroup = await groupService.createGroup(newGroup);
      setGroups([createdGroup, ...groups]);
      setNewGroup({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Group'}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                id="name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Create Group
            </button>
          </form>
        </div>
      )}

      {/* Groups List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">You haven't joined any groups yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 text-orange-500 hover:text-orange-600"
            >
              Create your first group
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
                <p className="text-sm text-gray-500">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Groups; 