/**
 * @file CandidateRow.tsx
 * @description
 * Componente di visualizzazione che rappresenta una singola riga (un candidato)
 * all'interno della CandidateTable. Riceve i dati di un candidato e li formatta
 * in celle di tabella, includendo un badge colorato per lo stato per una
 * rapida identificazione visiva.
 */

// Importiamo il tipo Candidate per garantire la coerenza dei dati con il nostro servizio.
import type { Candidate } from '../../services/candidateService';

// --- Type Definitions ---
interface CandidateRowProps {
  /** I dati completi del candidato da visualizzare in questa riga. */
  candidate: Candidate;
}

// --- Mappature di Stile ---

/**
 * Un oggetto di mappatura per associare uno stato di candidatura a classi CSS di Tailwind.
 * Questo centralizza la logica di styling e la rende facile da modificare.
 * Ad esempio, se volessimo cambiare il colore per lo stato 'reviewed',
 * modificheremmo solo questa riga.
 */
const statusColorMap: Record<Candidate['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
};

// --- Component Definition ---
const CandidateRow = ({ candidate }: CandidateRowProps) => {
  return (
    // Ogni riga della tabella rappresenta un candidato.
    // L'hover effect sulla riga genitore (in CandidateTable) darà feedback all'utente.
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      {/* Cella: Nome e Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
        <div className="text-sm text-gray-500">{candidate.email}</div>
      </td>

      {/* Cella: Stato (con badge colorato) */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`
            px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${statusColorMap[candidate.status] || 'bg-gray-100 text-gray-800'}
          `}
        >
          {/* Mostra il nome dello stato, con la prima lettera maiuscola per leggibilità */}
          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
        </span>
      </td>

      {/* Cella: Tags */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-wrap gap-1">
          {candidate.tags.map(tag => (
            // Ogni tag è un piccolo badge grigio per coerenza visiva.
            <span key={tag} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Cella: Azioni */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* Questo link sarà il punto di ingresso per la pagina di dettaglio del candidato. */}
        {/* Attualmente è un placeholder. */}
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Dettagli
        </a>
      </td>
    </tr>
  );
};

export default CandidateRow;