import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Il proxy di Nginx reindirizzerà questo
});

// Aggiungiamo il token a ogni richiesta se esiste
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;