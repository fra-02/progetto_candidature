/**
 * @file ReviewDisplay.tsx
 * @description
 * Componente per visualizzare i dettagli di una singola revisione (Fase 1 o 2)
 * in un formato leggibile e ben strutturato.
 */

import type { Review } from '../../services/candidateService';
import { reviewCriteria } from '../../config/reviewCriteria'; // Il nostro "dizionario" di criteri

interface ReviewDisplayProps {
  review: Review;
}

// Un piccolo componente helper per visualizzare un punteggio con delle stelle
const StarRating = ({ score }: { score: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < score ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewDisplay = ({ review }: ReviewDisplayProps) => {
  const reviewerInfo = `Revisione del ${new Date(review.createdAt).toLocaleDateString('it-IT')} (Utente #${review.userId})`;

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-md font-semibold text-gray-800">Fase {review.phase}</p>
        <p className="text-xs text-gray-500">{reviewerInfo}</p>
      </div>

      {/* --- Visualizzazione per la Fase 1 --- */}
      {review.phase === 1 && (
        <div className="space-y-2">
          <ul className="space-y-1 text-sm">
            {review.criteriaRatings && typeof review.criteriaRatings === 'object' ? (
              Object.entries(review.criteriaRatings).map(([criteriaId, score]) => {
                const criteriaLabel = reviewCriteria.find(c => c.id === criteriaId)?.label || criteriaId;
                return (
                  <li key={criteriaId} className="flex justify-between items-center">
                    <span className="text-gray-600">{criteriaLabel}:</span>
                    <StarRating score={score as number} />
                  </li>
                );
              })
            ) : (
              <p className="text-gray-500">Dati dei criteri non disponibili.</p>
            )}
          </ul>
          {review.notes && (
            <div className="pt-2">
              <p className="font-semibold text-sm">Note:</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">{review.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* --- Visualizzazione per la Fase 2 --- */}
      {review.phase === 2 && (
        <div className="text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Punteggio Finale:</span>
            <span className="font-bold text-lg text-blue-600">{review.finalScore} / 10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Decisione:</span>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              review.hireDecision ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {review.hireDecision ? 'ASSUMERE' : 'RIFIUTARE'}
            </span>
          </div>
          {review.finalComment && (
            <div className="pt-2">
              <p className="font-semibold text-sm">Commento Finale:</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">{review.finalComment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;