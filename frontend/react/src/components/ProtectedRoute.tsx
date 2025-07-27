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
  // La logica di autenticazione è semplice: controlla se il token esiste.
  // In un'applicazione reale, si potrebbe anche decodificare il token per verificarne la scadenza.
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // Se non c'è token, usiamo il componente <Navigate> di react-router per
    // eseguire un reindirizzamento dichiarativo. L'opzione `replace`
    // sostituisce la pagina corrente nella cronologia di navigazione,
    // così l'utente non può tornare indietro a una pagina protetta con il tasto "back".
    return <Navigate to="/login" replace />;
  }

  // Se l'utente è autenticato, renderizziamo il Layout, che a sua volta
  // si occuperà di renderizzare la rotta figlia corrispondente tramite <Outlet>.
  return <Layout />;
};

export default ProtectedRoute;