import api from './api';

export const groupService = {
  async createGroup(groupData) {
    try {
      const response = await api.post('/groups/create', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  async getMyGroups() {
    try {
      const response = await api.get('/groups/my-groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async getAvailableGroups(search = '') {
    try {
      const response = await api.get(`/groups/available${search ? `?search=${search}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available groups:', error);
      throw error;
    }
  },

  async joinGroup(groupId) {
    try {
      const response = await api.post(`/groups/join/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }
}; 