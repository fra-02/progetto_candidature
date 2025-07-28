/**
 * @file App.tsx
 * @description
 * Il componente principale dell'applicazione React.
 * Qui definiamo le rotte principali e avvolgiamo l'applicazione nel provider
 * per lo stato globale, che gestisce i dati condivisi tra i componenti.
 * Utilizziamo react-router per la navigazione tra le pagine.
 * Le pagine principali sono:
 * - LoginPage: per l'autenticazione degli utenti.
 * - DashboardPage: la pagina principale che mostra la lista dei candidati.
 * - CandidateDetailPage: per visualizzare i dettagli di un singolo candidato.
 * - ProtectedRoute: un wrapper che protegge le rotte riservate agli utenti autenticati,
 *   assicurandosi che l'utente abbia un token di autenticazione valido.
 *   Se non autenticato, reindirizza alla pagina di login.
 */


import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AppProvider } from './store/context'; // Importiamo il provider per lo stato globale
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CandidateDetailPage from './pages/CandidateDetailPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            {/* Queste sono le rotte protette che vengono renderizzate dentro il Layout */}
            <Route index element={<DashboardPage />} />
            <Route path="candidates/:id" element={<CandidateDetailPage />} /> {/* <-- 2. AGGIUNGI LA NUOVA ROTTA */}
          </Route>
          {/* Un fallback per reindirizzare qualsiasi rotta non trovata alla home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;