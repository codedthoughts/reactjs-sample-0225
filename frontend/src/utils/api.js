import axios from 'axios';

// Use environment variables for API URL with fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Task services
export const listService = {
  getLists: async () => {
    try {
      const response = await api.get('/lists');
      
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data; // For responses like { success: true, data: [...] }
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  },
  createList: async (listData) => {
    try {
      const response = await api.post('/lists', listData);
      
      // Return the actual list object, not the wrapper
      if (response.data && response.data.data) {
        return response.data.data; // For responses like { success: true, data: {...} }
      }
      return response.data;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  }
};

// Update taskService to include listId
export const taskService = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

export default api;