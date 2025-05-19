import axios from 'axios';
// Remove the process import
// import { env } from 'process';

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page or dispatch logout action
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  },

  // POST request with JSON data
  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  },

  // POST request with FormData
  postForm: async (endpoint, formData) => {
    try {
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('POST form request error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  },

  // PATCH request
  patch: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PATCH request error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.delete(endpoint, { data });
      return response.data;
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  },

  // Upload file(s)
  uploadFiles: async (endpoint, files, additionalData = {}) => {
    try {
      const formData = new FormData();
      
      // Add files to form data
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
      } else {
        formData.append('file', files);
      }
      
      // Add any additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
      
      return await apiService.postForm(endpoint, formData);
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
};

export default apiService;