/**
 * @file Layout.tsx
 * @description
 * Componente strutturale che definisce il layout principale dell'applicazione per le
 * sezioni protette. Include una sidebar di navigazione persistente, un'area per
 * le informazioni dell'utente, il pulsante di logout e un'area di contenuto
 * principale dove vengono renderizzate le pagine figlie tramite <Outlet>.
 */

import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  // Recuperiamo il nome utente dal localStorage per personalizzare l'UI.
  // Forniamo un fallback 'Utente' nel caso non sia presente.
  const username = localStorage.getItem('username') || 'Utente';

  /**
   * Gestisce la logica di logout: pulisce il localStorage dai dati di
   * sessione e reindirizza programmaticamente alla pagina di login.
   */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- Sidebar di Navigazione --- */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
          Gestione CV
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li>
              {/* Usiamo il componente <Link> di react-router per una navigazione client-side veloce. */}
              <Link to="/" className="block px-4 py-2 rounded transition duration-200 hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            {/* Questa sezione è pronta per essere estesa con futuri link di navigazione. */}
          </ul>
        </nav>
        {/* --- Area Utente e Logout --- */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Loggato come:</p>
            <p className="font-semibold">{username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Area Contenuto Principale --- */}
      {/* <Outlet> è un segnaposto speciale di react-router-dom dove verrà
          renderizzato il componente della rotta figlia attiva. */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;