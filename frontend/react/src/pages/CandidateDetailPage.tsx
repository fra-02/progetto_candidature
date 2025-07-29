/**
 * @file CandidateDetailPage.tsx
 * @description
 * Pagina che mostra i dettagli completi di un singolo candidato, gestisce la visualizzazione
 * e l'invio delle revisioni, e permette la cancellazione del candidato.
 */

import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCandidateById, deleteCandidate, type Candidate } from '../services/candidateService';
import { useAppState, useAppDispatch } from '../store/context';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewDisplay from '../components/reviews/ReviewDisplay';
import Modal from '../components/ui/Modal';

const CandidateDetailPage = () => {
  // --- Hooks ---
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidates } = useAppState();
  const dispatch = useAppDispatch();

  // --- Stato Locale del Componente ---
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // --- Logica Dati ---
  const candidateFromStore = useMemo(() => {
    if (!id) return null;
    return candidates.find(c => c.id === parseInt(id, 10));
  }, [candidates, id]);

  const loadFullCandidateData = async (candidateId: string) => {
    try {
      const data = await getCandidateById(candidateId);
      if (data) {
        setCandidate(data);
      } else {
        setError("Candidato non trovato.");
      }
    } catch (err) {
      setError("Errore nel caricamento dei dati del candidato.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!id) {
      setError("ID del candidato non fornito.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (candidateFromStore) {
      setCandidate(candidateFromStore);
    }
    loadFullCandidateData(id);
  }, [id, candidateFromStore]);

  // --- Handlers ---
  const handleReviewSuccess = () => {
    if (id) loadFullCandidateData(id);
  };

  const handleDeleteCandidate = async () => {
    if (!candidate) return;
    setDeleteError(null);
    try {
      await deleteCandidate(candidate.id);
      dispatch({ type: 'DELETE_CANDIDATE_SUCCESS', payload: { id: candidate.id } });
      navigate('/');
    } catch (err) {
      console.error(err);
      setDeleteError("Impossibile eliminare il candidato. Riprova.");
    }
  };

  // --- Render condizionale per caricamento, errori o dati non trovati ---
  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Caricamento candidato...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  if (!candidate) {
    return <div className="p-6 text-center">Nessun dato del candidato da mostrare.</div>;
  }

  // Se i dati sono pronti, calcoliamo le variabili per il rendering
  const hasPhase1Review = candidate.reviews.some(r => r.phase === 1);
  const hasPhase2Review = candidate.reviews.some(r => r.phase === 2);

  return (
    <>
      <div className="space-y-6">
        {/* --- Sezione Intestazione --- */}
        <div className="flex justify-between items-start">
            <div>
              <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">← Torna alla Dashboard</Link>
              <h1 className="text-3xl font-bold text-gray-800">{candidate.fullName}</h1>
              <p className="text-md text-gray-600">{candidate.email}</p>
              <a href={candidate.githubLink || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline" onClick={(e) => !candidate.githubLink && e.preventDefault()}>Profilo GitHub</a>
            </div>
            <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Elimina</button>
        </div>

        {/* --- Sezione Dettagli --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Dettagli Candidatura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div><span className="font-semibold text-gray-500">Stato:</span> {candidate.status}</div>
            <div><span className="font-semibold text-gray-500">Contatto (Sender):</span> {candidate.sender}</div>
            <div><span className="font-semibold text-gray-500">ID Univoco (UUID):</span> {candidate.uuid}</div>
            <div><span className="font-semibold text-gray-500">Data Creazione:</span> {new Date(candidate.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* --- Sezione Competenze --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* ... (contenuto invariato) ... */}
        </div>

        {/* --- Sezione Revisioni --- */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Revisioni</h2>
          {candidate.reviews.length > 0 ? (
            candidate.reviews.slice().sort((a, b) => a.phase - b.phase).map(review => <ReviewDisplay key={review.id} review={review} />)
          ) : (
            <p className="text-sm text-gray-500">Nessuna revisione presente.</p>
          )}
          <div className="border-t pt-6">
            {!hasPhase1Review && <ReviewForm phase={1} candidateId={candidate.id} onSubmitSuccess={handleReviewSuccess} />}
            {hasPhase1Review && !hasPhase2Review && <ReviewForm phase={2} candidateId={candidate.id} onSubmitSuccess={handleReviewSuccess} />}
            {hasPhase1Review && hasPhase2Review && <p className="text-center text-green-600 font-semibold">Processo di revisione completato.</p>}
          </div>
        </div>
      </div>

      {/* --- Modale di Conferma Cancellazione --- */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Conferma Eliminazione">
        <div className="space-y-4">
            <p>Sei sicuro di voler eliminare il candidato <span className="font-bold">{candidate.fullName}</span>?</p>
            <p className="text-sm text-red-600">L'azione non può essere annullata.</p>
            {deleteError && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{deleteError}</p>}
            <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annulla</button>
                <button onClick={handleDeleteCandidate} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sì, Elimina</button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default CandidateDetailPage;