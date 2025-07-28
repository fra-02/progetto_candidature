/**
 * @file CandidateDetailPage.tsx
 * @description
 * Pagina che mostra i dettagli completi di un singolo candidato.
 * Utilizza un approccio ibrido: cerca prima il candidato nello store globale per un
 * caricamento istantaneo, ma esegue comunque una chiamata API in background per
 * assicurarsi di avere i dati più recenti e completi.
 */

import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidateById, type Candidate } from '../services/candidateService';
import { useAppState } from '../store/context';

const CandidateDetailPage = () => {
  // Recuperiamo l'ID del candidato dalla URL.
  const { id } = useParams<{ id: string }>();
  
  // Accediamo alla lista di candidati dallo store globale.
  const { candidates } = useAppState();

  // Stato locale per il candidato visualizzato, caricamento ed errore.
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // `useMemo` per trovare il candidato nello store in modo efficiente.
  // Si ricalcola solo se la lista di candidati o l'ID cambiano.
  const candidateFromStore = useMemo(() => {
    if (!id) return null;
    return candidates.find(c => c.id === parseInt(id, 10));
  }, [candidates, id]);


  useEffect(() => {
    if (!id) {
      setError("ID del candidato non fornito.");
      setIsLoading(false);
      return;
    }

    // Se troviamo il candidato nello store, lo usiamo subito
    if (candidateFromStore) {
      setCandidate(candidateFromStore);
    }
    
    // Eseguiamo sempre la chiamata API per ottenere i dati più recenti e completi.
    const loadFullCandidateData = async () => {
      // Manteniamo lo stato di caricamento solo se non abbiamo dati parziali dallo store.
      setIsLoading(!candidateFromStore); 
      setError(null);

      try {
        const data = await getCandidateById(id);
        if (data) {
          setCandidate(data); // Aggiorniamo lo stato con i dati completi
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

    loadFullCandidateData();
  }, [id, candidateFromStore]); // Dipendenze dell'effetto.

  
  // --- Logica di Rendering ---

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Caricamento candidato...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!candidate) {
    return <div className="p-6 text-center">Nessun dato del candidato da mostrare.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Intestazione con nome e link per tornare indietro */}
      <div>
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Torna alla Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{candidate.fullName}</h1>
        <p className="text-md text-gray-600">{candidate.email}</p>
        <a 
          href={candidate.githubLink || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-500 hover:underline"
          // Disabilita il link se non presente
          onClick={(e) => !candidate.githubLink && e.preventDefault()}
        >
          Profilo GitHub
        </a>
      </div>

      {/* Card: Dettagli Principali */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dettagli Candidatura</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div><span className="font-semibold text-gray-500">Stato:</span> {candidate.status}</div>
          <div><span className="font-semibold text-gray-500">Contatto (Sender):</span> {candidate.sender}</div>
          <div><span className="font-semibold text-gray-500">ID Univoco (UUID):</span> {candidate.uuid}</div>
          <div><span className="font-semibold text-gray-500">Data Creazione:</span> {new Date(candidate.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Card: Competenze (Tags) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Competenze</h2>
        <div className="flex flex-wrap gap-2">
          {(candidate.tags || []).length > 0 ? (
            (candidate.tags || []).map(tag => (
              <span key={tag.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{tag.name}</span>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nessuna competenza specificata.</p>
          )}
        </div>
      </div>

      {/* Placeholder per la sezione Revisioni */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Revisioni e Risposte</h2>
        <p className="text-gray-500">
          (Qui verranno visualizzate le revisioni esistenti e i form per aggiungerne di nuove).
        </p>
      </div>
    </div>
  );
};

export default CandidateDetailPage;