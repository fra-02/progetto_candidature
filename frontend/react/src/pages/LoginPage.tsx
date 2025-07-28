/**
 * @file LoginPage.tsx
 * @description
 * Pagina di accesso per gli operatori. Gestisce la chiamata API per l'autenticazione,
 * salva il token JWT ricevuto e reindirizza l'utente alla dashboard in caso di successo.
 * Mostra anche messaggi di errore specifici e un feedback di caricamento.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService'; // Il nostro servizio API centralizzato

const LoginPage = () => {
  // Stati per i campi del form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Stati per la UI
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    setError(null);     // Pulisce errori precedenti
    setIsLoading(true); // Attiva l'indicatore di caricamento

    // Validazione base
    if (!username.trim() || !password.trim()) {
      setError('Per favore, inserisci username e password.');
      setIsLoading(false);
      return;
    }

    try {
      // --- CHIAMATA API REALE ---
      // Usiamo il nostro apiService per fare una POST a /auth/login.
      // L'URL base (http://localhost:3000/api) è già configurato in apiService.
      const response = await apiService.post('/auth/login', {
        username,
        password,
      });

      // Il backend risponde con un oggetto { token: "..." }
      const { token } = response.data;

      // Se la chiamata ha successo, salviamo il token e il nome utente
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);

      // Reindirizziamo alla dashboard
      navigate('/');

    } catch (err: any) {
      // Se il login fallisce, axios lancia un errore.
      console.error("Errore di login:", err);
      // Mostriamo un messaggio di errore all'utente
      setError(err.response?.data?.message || 'Credenziali non valide o errore del server.');
    } finally {
      // In ogni caso (successo o fallimento), disattiviamo l'indicatore di caricamento.
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Accesso Operatori
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo Username */}
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome Utente (es. admin)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              disabled={isLoading}
            />
          </div>
          {/* Campo Password */}
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (es. password123)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              disabled={isLoading}
            />
          </div>

          {/* Messaggio di Errore */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;