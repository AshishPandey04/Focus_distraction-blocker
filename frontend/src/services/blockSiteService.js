import api from './api';

export const blockSiteService = {
  async getBlockedSites() {
    try {
      const response = await api.get('/blocked-sites');
      return response.data;
    } catch (error) {
      console.error('Error fetching blocked sites:', error);
      throw error;
    }
  },

  async addBlockedSite(url) {
    try {
      const response = await api.post('/blocked-sites', { url });
      return response.data;
    } catch (error) {
      console.error('Error adding blocked site:', error);
      throw error;
    }
  },

  async removeBlockedSite(siteId) {
    try {
      const response = await api.delete(`/blocked-sites/${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing blocked site:', error);
      throw error;
    }
  }
}; 