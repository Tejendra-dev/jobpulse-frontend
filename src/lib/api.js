import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Automatically attach token to every request if logged in
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);
export const getMe = () => API.get('/api/auth/me');

// Jobs
export const getJobs = (params) => API.get('/api/jobs', { params });
export const getJobById = (id) => API.get(`/api/jobs/${id}`);
export const createJob = (data) => API.post('/api/jobs', data);
export const updateJob = (id, data) => API.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/api/jobs/${id}`);

// Analytics
export const getAnalytics = () => API.get('/api/analytics/summary');