// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.3:8000/api/avatar';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const avatarAPI = {
  // ▶ Start session
  startSession: async (avatarId, avatarPersona) => {
    try {
      const response = await api.post('/session/start', {
        avatar_id: avatarId,
        mode: 'FULL',
        avatar_persona: avatarPersona,
      });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  // ▶ Keep session alive
  keepSessionAlive: async (sessionId) => {
    try {
      const response = await api.post('/session/keepalive', {
        session_id: sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error keeping session alive:', error);
      throw error;
    }
  },

  // ▶ Stop session
  stopSession: async (sessionId, reason = 'UNKNOWN') => {
    try {
      const response = await api.post('/session/stop', {
        session_id: sessionId,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error stopping session:', error);
      throw error;
    }
  },

  // ▶ Get avatar meta
  getAvatar: async (avatarId) => {
    try {
      const response = await api.get(`/avatars/${avatarId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      throw error;
    }
  },

  // ▶ Create context
  createContext: async (name, links, prompt = '') => {
    try {
      const response = await api.post('/context', {
        name,
        links,
        prompt,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating context:', error);
      throw error;
    }
  },

  // ▶ Get context
  getContext: async (contextId) => {
    try {
      const response = await api.get(`/context/${contextId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching context:', error);
      throw error;
    }
  },
};

export default api;
