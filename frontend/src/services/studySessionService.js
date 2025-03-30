import api from './api';

export const studySessionService = {
  async startSession() {
    try {
      const response = await api.post('/study-sessions/start');
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  async endSession(sessionId) {
    try {
      const response = await api.put(`/study-sessions/end/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  async getTodaySessions() {
    try {
      const response = await api.get('/study-sessions/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      throw error;
    }
  }
}; 