/**
 * @file CandidateRow.tsx
 * @description
 * Componente di visualizzazione che rappresenta una singola riga (un candidato)
 * all'interno della CandidateTable. È stato reso resiliente per gestire
 * casi in cui i dati (come i tag) potrebbero non essere presenti.
 */

import type { Candidate, Tag } from '../../services/candidateService';
import { Link } from 'react-router-dom';

interface CandidateRowProps {
  candidate: Candidate;
}

const statusColorMap: Record<Candidate['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
};

const CandidateRow = ({ candidate }: CandidateRowProps) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      {/* Cella: Nome e Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
        <div className="text-sm text-gray-500">{candidate.email}</div>
      </td>

      {/* Cella: Stato */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[candidate.status] || 'bg-gray-100 text-gray-800'}`}
        >
          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
        </span>
      </td>

      {/* Cella: Tags*/}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-wrap gap-1">
          {(candidate.tags || []).map((tag: Tag) => (
            <span key={tag.id} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md">
              {tag.name}
            </span>
          ))}
        </div>
      </td>

      {/* Cella: Azioni */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link to = {`/candidates/${candidate.id}`} className="text-blue-600 hover:text-blue-900">
          Dettagli
        </Link>
      </td>
    </tr>
  );
};

export default CandidateRow;