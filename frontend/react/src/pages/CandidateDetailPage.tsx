/**
 * @file CandidateDetailPage.tsx
 * @description
 * Pagina che mostra i dettagli completi di un singolo candidato, gestisce la visualizzazione
 * e l'invio delle revisioni, e permette la modifica e la cancellazione del candidato.
 */

import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCandidateById, deleteCandidate, updateCandidate, type Candidate } from '../services/candidateService';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Candidate>>({});

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

  const handleEditToggle = () => {
    if (!candidate) return;
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditFormData({
        fullName: candidate.fullName,
        email: candidate.email,
        githubLink: candidate.githubLink,
        status: candidate.status,
      });
      setIsEditing(true);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
        console.error("Tentativo di aggiornamento senza ID del candidato.");
        // Mostra un errore all'utente qui
        return;
    }

    try {
      const candidateId = parseInt(id, 10);
      const updatedCandidate = await updateCandidate(candidateId, editFormData);
      dispatch({ type: 'UPDATE_CANDIDATE_SUCCESS', payload: updatedCandidate });
      setCandidate(updatedCandidate);
      setIsEditing(false);
    } catch (err) {
      console.error("Errore durante l'aggiornamento", err);
      // In un'app reale, mostreremmo un toast di errore
    }
  };

  // --- Render condizionale principale ---
  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Caricamento candidato...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  if (!candidate) {
    return <div className="p-6 text-center">Nessun dato del candidato da mostrare.</div>;
  }

  // --- Variabili calcolate per il render ---
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
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button onClick={handleEditToggle} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">{isEditing ? 'Annulla' : 'Modifica'}</button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">Elimina</button>
            </div>
        </div>

        {/* --- Sezione Dettagli (Form Condizionale) --- */}
        <form onSubmit={handleUpdateCandidate}>
            <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Dettagli Candidatura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                    <label className="font-semibold text-gray-500 block mb-1">Nome Completo</label>
                    {isEditing ? <input type="text" name="fullName" value={editFormData.fullName || ''} onChange={handleFormChange} className="w-full border rounded-md p-1.5 text-sm" /> : <p>{candidate.fullName}</p>}
                </div>
                <div>
                    <label className="font-semibold text-gray-500 block mb-1">Email</label>
                    {isEditing ? <input type="email" name="email" value={editFormData.email || ''} onChange={handleFormChange} className="w-full border rounded-md p-1.5 text-sm" /> : <p>{candidate.email}</p>}
                </div>
                <div>
                    <label className="font-semibold text-gray-500 block mb-1">Stato</label>
                    {isEditing ? (
                        <select name="status" value={editFormData.status || ''} onChange={handleFormChange} className="w-full border rounded-md p-1.5 text-sm bg-white">
                            <option value="pending">In attesa</option>
                            <option value="reviewed">Valutato</option>
                            <option value="rejected">Rifiutato</option>
                        </select>
                    ) : <p className="capitalize">{candidate.status}</p>}
                </div>
                <div>
                    <label className="font-semibold text-gray-500 block mb-1">Profilo GitHub</label>
                    {isEditing ? <input type="text" name="githubLink" value={editFormData.githubLink || ''} onChange={handleFormChange} className="w-full border rounded-md p-1.5 text-sm" /> : <a href={candidate.githubLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{candidate.githubLink || 'Non fornito'}</a>}
                </div>
                <div className="md:col-span-2"><span className="font-semibold text-gray-500">ID Univoco (UUID):</span> {candidate.uuid}</div>
                <div className="md:col-span-2"><span className="font-semibold text-gray-500">Contatto (Sender):</span> {candidate.sender}</div>
            </div>
            {isEditing && (
                <div className="mt-6 border-t pt-4 text-right">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Salva Modifiche</button>
                </div>
            )}
            </div>
        </form>

        {/* --- Card: Competenze (Tags) --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Competenze</h2>
            <div className="flex flex-wrap gap-2">
                {(candidate.tags || []).map(tag => (<span key={tag.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{tag.name}</span>))}
            </div>
        </div>

        {/* --- Card: Revisioni --- */}
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