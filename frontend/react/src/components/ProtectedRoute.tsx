/**
 * @file ProtectedRoute.tsx
 * @description
 * Componente di alto livello che agisce come "guardia" (auth guard) per le rotte protette.
 * La sua unica responsabilità è controllare la presenza di un token di autenticazione
 * nel localStorage. Se l'utente è autenticato, renderizza il Layout principale
 * (che a sua volta renderizzerà la pagina richiesta). Altrimenti, reindirizza
 * l'utente alla pagina di login, impedendo l'accesso non autorizzato.
 */

import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const ProtectedRoute = () => {
  // Logica di autenticazione: controlla se il token esiste.
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // Se non è autenticato, reindirizza alla pagina di login.
    return <Navigate to="/login" replace />;
  }

  // Se è autenticato, renderizza il Layout principale.
  return <Layout />;
};

export default ProtectedRoute;