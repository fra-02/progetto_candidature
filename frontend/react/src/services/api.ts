import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', 
});

const mockCandidates = [
  { id: 1, fullName: "Mario Rossi", status: "pending", tags: ["tecnico"] },
  { id: 2, fullName: "Laura Bianchi", status: "reviewed", tags: ["hr"] },
  // ... altri candidati
];

export const getCandidates = async (page = 1, limit = 10, filters = {}) => {
  console.log("Fetching candidates with filters:", filters);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula la rete
  return {
    data: mockCandidates.slice((page - 1) * limit, page * limit),
    totalPages: Math.ceil(mockCandidates.length / limit),
  };
};

// Aggiungiamo il token a ogni richiesta se esiste
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;