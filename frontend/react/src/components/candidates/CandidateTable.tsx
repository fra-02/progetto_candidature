/**
 * @file CandidateTable.tsx
 * @description
 * Componente di visualizzazione che renderizza una tabella completa di candidati.
 * Riceve un array di candidati e si occupa di mappare ogni candidato al componente
 * `CandidateRow` per la visualizzazione. Gestisce anche lo stato in cui non
 * ci sono candidati da mostrare, fornendo un feedback chiaro all'utente.
 */

// Importiamo il tipo Candidate per mantenere la coerenza dei dati.
import type { Candidate } from '../../services/candidateService';
// Importiamo il componente che renderizza la singola riga.
import CandidateRow from './CandidateRow';

// --- Type Definitions ---
interface CandidateTableProps {
  /** L'array di candidati da visualizzare nella tabella. Può essere vuoto. */
  candidates: Candidate[];
}

// --- Component Definition ---
const CandidateTable = ({ candidates }: CandidateTableProps) => {
  return (
    // Un contenitore con ombra e angoli arrotondati per incapsulare la tabella.
    // `overflow-hidden` è importante per assicurare che gli angoli arrotondati
    // vengano applicati correttamente all'header e al footer della tabella.
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Definiamo le intestazioni della tabella. Sono statiche e descrivono i dati. */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidato
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stato
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            {/* L'ultima colonna è per le azioni e non necessita di un'etichetta visibile. */}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Azioni</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* --- Rendering Condizionale delle Righe --- */}
          
          {/* Caso 1: Ci sono candidati da mostrare. */}
          {candidates.length > 0 &&
            candidates.map((candidate) => (
              // Usiamo l'ID del candidato come `key`, che è fondamentale per React
              // per ottimizzare il rendering delle liste.
              <CandidateRow key={candidate.id} candidate={candidate} />
            ))}

          {/* Caso 2: L'array di candidati è vuoto. */}
          {/* Mostriamo una riga singola con un messaggio per l'utente. */}
          {/* Questo è molto meglio di una tabella vuota, che potrebbe sembrare un errore. */}
          {candidates.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                Nessun candidato trovato.
                <br />
                <span className="text-sm">Prova a modificare i filtri o a resettarli.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;