import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  getHouseholdMembers: (householdId: string) => api.get(`/auth/household/${householdId}`),
};

// Routines API
export const routinesAPI = {
  getAll: (filters?: any) => api.get('/routines', { params: filters }),
  getById: (id: string) => api.get(`/routines/${id}`),
  lottery: (filters: any) => api.post('/routines/lottery', filters),
  create: (data: any) => api.post('/routines', data),
  update: (id: string, data: any) => api.put(`/routines/${id}`, data),
  delete: (id: string) => api.delete(`/routines/${id}`),
  getMetadata: () => api.get('/routines/meta/categories'),
};

// Recipes API
export const recipesAPI = {
  getAll: (filters?: any) => api.get('/recipes', { params: filters }),
  getById: (id: string) => api.get(`/recipes/${id}`),
  create: (data: any) => api.post('/recipes', data),
  update: (id: string, data: any) => api.put(`/recipes/${id}`, data),
  delete: (id: string) => api.delete(`/recipes/${id}`),
  getMetadata: () => api.get('/recipes/meta/categories'),
};

// Meal Plans API
export const mealPlansAPI = {
  getAll: (filters?: any) => api.get('/meal-plans', { params: filters }),
  getCurrent: () => api.get('/meal-plans/current'),
  generate: (data: any) => api.post('/meal-plans/generate', data),
  update: (id: string, data: any) => api.put(`/meal-plans/${id}`, data),
  delete: (id: string) => api.delete(`/meal-plans/${id}`),
  getGroceryList: (id: string) => api.get(`/meal-plans/${id}/grocery-list`),
};

// Journal API
export const journalAPI = {
  getAll: (filters?: any) => api.get('/journal', { params: filters }),
  getByDate: (date: string) => api.get(`/journal/date/${date}`),
  create: (data: any) => api.post('/journal', data),
  update: (id: string, data: any) => api.put(`/journal/${id}`, data),
  delete: (id: string) => api.delete(`/journal/${id}`),
  getAnalytics: (filters?: any) => api.get('/journal/analytics', { params: filters }),
};

export default api;
