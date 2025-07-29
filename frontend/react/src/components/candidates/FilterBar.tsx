/**
 * @file FilterBar.tsx
 * @description
 * Componente UI che fornisce i controlli di filtraggio primari e sempre visibili.
 * Attualmente gestisce la ricerca testuale e ospita i pulsanti per le azioni
 * di filtro globali, come l'apertura del pannello avanzato e il reset completo.
 */

// --- Type Definitions ---
interface FilterBarProps {
  /** Il valore corrente del campo di ricerca. */
  searchTerm: string;
  /** Callback invocata quando il valore della ricerca cambia. */
  onSearchChange: (term: string) => void;
  /** Callback invocata quando si clicca sul pulsante "Filtri Avanzati". */
  onAdvancedFilterClick: () => void;
  /** Callback invocata quando si clicca sul pulsante "Reset". */
  onResetFilters: () => void;
  hasActiveAdvancedFilters: boolean;
}

// --- Component Definition ---
const FilterBar = ({
  searchTerm,
  onSearchChange,
  onAdvancedFilterClick,
  onResetFilters,
  hasActiveAdvancedFilters,
}: FilterBarProps) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4 flex flex-col sm:flex-row items-center gap-4">
      {/* --- Sezione di Ricerca --- */}
      <div className="flex-grow w-full">
        <input
          type="text"
          placeholder="Cerca candidato per nome..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cerca candidato per nome"
        />
      </div>

      {/* --- Sezione Pulsanti di Azione --- */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <button
          onClick={onAdvancedFilterClick}
          className={`
            px-4 py-2 rounded-md focus:outline-none focus:ring-2 flex items-center gap-2
            transition-colors duration-200
            ${
              hasActiveAdvancedFilters
                ? 'bg-blue-100 text-blue-800 ring-blue-300 font-semibold' // Stile "attivo"
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 ring-gray-400' // Stile normale
            }
          `}
          aria-haspopup="true" // Indica che il pulsante apre un altro elemento (il pannello)
          aria-expanded={hasActiveAdvancedFilters}
        >
          <span>Filtri Avanzati</span>
          {/* Indicatore visivo che appare solo se ci sono filtri avanzati attivi */}
          {hasActiveAdvancedFilters && (
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" aria-label="Filtri avanzati attivi"></span>
          )}
        </button>

        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label="Resetta tutti i filtri"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;