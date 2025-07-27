// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita che la pagina si ricarichi

    if (!username.trim()) {
      alert('Per favore, inserisci un nome utente.');
        return;
    }

    // --- Logica del Login "Finto" ma Persistente ---
    localStorage.setItem('authToken', 'un-token-finto-ma-valido');
    localStorage.setItem('username', username);

    // Reindirizza alla pagina principale
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Accesso Operatori
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome Utente"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition duration-300"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;