/**
 * @file DashboardPage.tsx
 * @description
 * Componente principale che funge da "cruscotto" per la visualizzazione e la gestione
 * dei candidati. Orchestra la logica di stato per i filtri (base e avanzati), la paginazione,
 * e l'interazione con i dati. È il cuore dell'interfaccia utente dell'operatore.
 */

// --- Imports ---
import { useEffect, useState, useMemo } from 'react';

// Tipi e funzioni per l'accesso ai dati
import type { Candidate } from '../services/candidateService';
import { availableTags, getCandidates } from '../services/candidateService';

// Componenti UI riutilizzabili
import CandidateTable from '../components/candidates/CandidateTable';
import FilterBar from '../components/candidates/FilterBar';
import OptionFilterGroup, { type FilterOption } from '../components/candidates/OptionFilterGroup';
import Pagination from '../components/ui/Pagination';
import SlideInPanel from '../components/ui/SlideInPanel';

// --- Costanti di Configurazione ---

// Definiamo le opzioni per il filtro di stato in un'unica costante.
// Questo rende più facile aggiungere/rimuovere stati in futuro.
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'rejected', label: 'Rejected' },
];

const TAG_OPTIONS: FilterOption[] = availableTags.map(tag => ({
  value: tag.toLowerCase(), 
  label: tag.charAt(0).toUpperCase() + tag.slice(1).replace('js', '.js'),
}));

const ITEMS_PER_PAGE = 10;

// --- Component Definition ---
const DashboardPage = () => {
  // --- State Management ---

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stati per i filtri. Abbiamo separato i filtri base (searchTerm) da quelli avanzati.
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Stato per la UI (visibilità del pannello e paginazione)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const data = await getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error("Errore nel caricamento dei candidati:", error);
        // TODO: Mostrare un messaggio di errore all'utente.
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // --- Event Handlers & Logic ---

  const applyFiltersAndResetPage = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedTags([]);
    applyFiltersAndResetPage();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleStatusToggle = (statusValue: string) => {
    setSelectedStatuses(prev => prev.includes(statusValue) ? prev.filter(s => s !== statusValue) : [...prev, statusValue]);
  };
  
  const handleApplyAdvancedFilters = () => {
    applyFiltersAndResetPage();
    setIsPanelOpen(false);
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= processedCandidates.totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Memoized Computation for Performance ---
  const processedCandidates = useMemo(() => {
    const filtered = candidates
      .filter(c => c.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => selectedStatuses.length === 0 || selectedStatuses.includes(c.status))
      .filter(c => selectedTags.length === 0 || selectedTags.every(tag => c.tags.includes(tag)));

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedCandidates = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return { paginatedCandidates, totalPages };
  }, [candidates, searchTerm, selectedStatuses, selectedTags, currentPage]);

  // --- Render Logic (JSX) ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Candidati</h1>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(term) => { setSearchTerm(term); applyFiltersAndResetPage(); }}
        onAdvancedFilterClick={() => setIsPanelOpen(true)}
        onResetFilters={handleResetFilters}
        hasActiveAdvancedFilters={selectedTags.length > 0 || selectedStatuses.length > 0}
      />

      {isLoading ? (
        <p className="text-center text-gray-500 py-10">Caricamento candidati...</p>
      ) : (
        <>
          <CandidateTable candidates={processedCandidates.paginatedCandidates} />
          <Pagination
            currentPage={currentPage}
            totalPages={processedCandidates.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <SlideInPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Filtri Avanzati"
        footer={
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => {
                setSelectedStatuses([]);
                setSelectedTags([]);
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Pulisci Filtri Pannello
            </button>
            <button
              onClick={handleApplyAdvancedFilters}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Applica
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* --- Filtro per Stato (usando la modalità 'checkbox') --- */}
          <OptionFilterGroup
            title="Stato Candidatura"
            options={STATUS_OPTIONS}
            selectedOptions={selectedStatuses}
            onToggleOption={handleStatusToggle}
            displayMode="checkbox"
          />
          
          <hr />

          {/* --- Filtro per Tag (usando la modalità 'pill') --- */}
          <OptionFilterGroup
            title="Competenze e Tecnologie"
            options={TAG_OPTIONS}
            selectedOptions={selectedTags}
            onToggleOption={handleTagToggle}
            displayMode="pill"
          />
        </div>
      </SlideInPanel>
    </div>
  );
};

export default DashboardPage;