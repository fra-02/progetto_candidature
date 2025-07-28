/**
 * @file apiService.ts
 * @description
 * Servizio centralizzato per tutte le chiamate API, basato su Axios.
 * Gestisce la configurazione base (baseURL) e l'iniezione automatica
 * del token JWT di autenticazione in tutte le richieste protette.
 */
import axios from 'axios';

// 1. Creiamo un'istanza di Axios con la configurazione di base.
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Leggiamo l'URL dal file .env
});

// 2. Usiamo un "interceptor" per modificare ogni richiesta prima che parta.
apiService.interceptors.request.use(
  (config) => {
    // Recupera il token dal localStorage.
    const token = localStorage.getItem('authToken');

    // Se il token esiste, lo aggiunge all'header 'Authorization'.
    // Il backend si aspetta il formato 'Bearer [token]'.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ritorna la configurazione della richiesta (con o senza token).
    return config;
  },
  (error) => {
    // Se c'è un errore durante la preparazione della richiesta, lo rifiutiamo.
    return Promise.reject(error);
  }
);

export default apiService;