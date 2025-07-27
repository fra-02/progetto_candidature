/**
 * @file Pagination.tsx
 * @description
 * Componente UI semplice e riutilizzabile per la navigazione tra le pagine di una lista.
 * Mostra i pulsanti "Precedente" e "Successivo" e un indicatore testuale della pagina corrente.
 * Il componente è "controllato", ovvero non gestisce lo stato internamente ma riceve
 * tutto ciò di cui ha bisogno tramite props e notifica il genitore dei cambi di pagina.
 */

// --- Type Definitions ---
interface PaginationProps {
  /** La pagina attualmente attiva. */
  currentPage: number;
  /** Il numero totale di pagine disponibili. */
  totalPages: number;
  /** Callback invocata quando l'utente clicca per cambiare pagina. */
  onPageChange: (page: number) => void;
}

// --- Component Definition ---
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // --- Early return per UI pulita ---
  // Se non c'è più di una pagina, la paginazione non è necessaria.
  // Ritornare null invece di un div vuoto è più pulito e performante.
  if (totalPages <= 1) {
    return null;
  }

  return (
    // Usiamo un tag <nav> per la semantica HTML, indicando che questo è un blocco di navigazione.
    // Gli attributi aria-* migliorano l'accessibilità per gli screen reader.
    <nav
      aria-label="Paginazione"
      className="mt-6 flex items-center justify-between"
    >
      {/* --- Pulsante Precedente --- */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        // Il pulsante è disabilitato se siamo già sulla prima pagina.
        disabled={currentPage === 1}
        // Le classi `disabled:*` di Tailwind gestiscono lo stile del pulsante disabilitato.
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        // Miglioramento per l'accessibilità: descrive l'azione
        aria-label="Vai alla pagina precedente"
      >
        Precedente
      </button>

      {/* --- Indicatore di Pagina --- */}
      <span className="text-sm text-gray-700" aria-live="polite" aria-atomic="true">
        Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
      </span>

      {/* --- Pulsante Successivo --- */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        // Il pulsante è disabilitato se siamo già sull'ultima pagina.
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Vai alla pagina successiva"
      >
        Successivo
      </button>
    </nav>
  );
};

export default Pagination;