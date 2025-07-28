/**
 * @file DashboardPage.tsx
 * @description
 * Componente principale della dashboard. 
 * Ora si affida allo store globale per i dati principali (candidati, tag)
 * e mantiene solo lo stato locale per i controlli dell'interfaccia (filtri, paginazione).
 */

import { useEffect, useState, useMemo } from 'react';

// Servizi per le chiamate API
import { getCandidates, getAvailableTags } from '../services/candidateService';

// Store globale per lo stato
import { useAppState, useAppDispatch } from '../store/context';
import type { FilterOption } from '../components/candidates/OptionFilterGroup';

// Componenti UI
import CandidateTable from '../components/candidates/CandidateTable';
import FilterBar from '../components/candidates/FilterBar';
import Pagination from '../components/ui/Pagination';
import SlideInPanel from '../components/ui/SlideInPanel';
import OptionFilterGroup from '../components/candidates/OptionFilterGroup';

// Costanti di configurazione per la UI
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'pending', label: 'In attesa' },
  { value: 'reviewed', label: 'Valutato' },
  { value: 'rejected', label: 'Rifiutato' },
];
const ITEMS_PER_PAGE = 10;


const DashboardPage = () => {
  // Lo stato principale (dati, caricamento, errori) viene dallo store globale.
  const { candidates, availableTags, isLoading, error } = useAppState();
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Questo useEffect si occupa di caricare i dati iniziali quando
  // il componente viene montato per la prima volta.
  useEffect(() => {
    const loadInitialData = async () => {
      // Lanciamo un'azione per dire all'app "sto iniziando a caricare".
      // Questo imposterà isLoading a true in tutto lo store.
      dispatch({ type: 'FETCH_DATA_START' });
      try {
        // Chiamiamo le API in parallelo per ottimizzare i tempi.
        const [candidatesData, tagsData] = await Promise.all([
          getCandidates(),
          getAvailableTags(),
        ]);
        // Se tutto va bene, lanciamo l'azione di successo con i dati ricevuti.
        dispatch({
          type: 'FETCH_DATA_SUCCESS',
          payload: { candidates: candidatesData, tags: tagsData },
        });
      } catch (err) {
        console.error("Errore nel caricamento dei dati iniziali:", err);
        // In caso di errore, lo comunichiamo allo store.
        dispatch({
          type: 'FETCH_DATA_FAILURE',
          payload: 'Impossibile caricare i dati. Riprova più tardi.',
        });
      }
    };

    // Eseguiamo il caricamento solo se non abbiamo già i dati,
    // per evitare chiamate API inutili se si torna su questa pagina.
    if (candidates.length === 0 && !error) {
      loadInitialData();
    }
  }, [dispatch, candidates.length, error]);

  // --- Handlers per l'interazione con l'UI ---

  const applyFiltersAndResetPage = () => setCurrentPage(1);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedTags([]);
    applyFiltersAndResetPage();
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };
  
  const handleStatusToggle = (statusValue: string) => {
    setSelectedStatuses(prev => 
      prev.includes(statusValue) ? prev.filter(s => s !== statusValue) : [...prev, statusValue]
    );
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

  // --- Logica di calcolo ---

  // Trasformiamo i dati dei tag (che arrivano come {id, name})
  // nel formato {value, label} che serve al nostro componente di filtro.
  const tagFilterOptions: FilterOption[] = useMemo(() => {
    return availableTags.map(tag => ({
      value: tag.name,
      label: tag.name,
    }));
  }, [availableTags]);

  // Calcoliamo la lista dei candidati da mostrare (filtrati e paginati).
  // useMemo evita di rifare questi calcoli a ogni render, ma solo se i dati o i filtri cambiano.
  const processedCandidates = useMemo(() => {
    const filtered = candidates
      .filter(c => c.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => selectedStatuses.length === 0 || selectedStatuses.includes(c.status))
      .filter(c => selectedTags.length === 0 || selectedTags.every(selectedTag => 
        c.tags.some(candidateTag => candidateTag.name === selectedTag)
      ));

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedCandidates = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return { paginatedCandidates, totalPages };
  }, [candidates, searchTerm, selectedStatuses, selectedTags, currentPage]);


  // --- Logica di Rendering ---

  // Gestiamo prima gli stati principali: caricamento ed errore.
  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 py-10">Caricamento dati in corso...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500 py-10">{error}</div>;
  }

  // Se i dati sono pronti, renderizziamo la dashboard completa.
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

      <CandidateTable candidates={processedCandidates.paginatedCandidates} />
      
      <Pagination
        currentPage={currentPage}
        totalPages={processedCandidates.totalPages}
        onPageChange={handlePageChange}
      />

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
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Resetta Filtri
            </button>
            <button
              onClick={handleApplyAdvancedFilters}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              Applica
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <OptionFilterGroup
            title="Stato Candidatura"
            options={STATUS_OPTIONS}
            selectedOptions={selectedStatuses}
            onToggleOption={handleStatusToggle}
            displayMode="checkbox"
          />
          <hr />
          <OptionFilterGroup
            title="Competenze e Tecnologie"
            options={tagFilterOptions}
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