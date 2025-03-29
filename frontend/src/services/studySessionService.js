import api from './api';

export const studySessionService = {
  async startSession() {
    const response = await api.post('/study-sessions/start');
    return response.data;
  },

  async endSession(sessionId) {
    const response = await api.put(`/study-sessions/end/${sessionId}`);
    return response.data;
  },

  async getTodaySessions() {
    const response = await api.get('/study-sessions/today');
    return response.data;
  }
}; 