/**
 * @file ReviewForm.tsx
 * @description
 * Form per aggiungere una revisione di Fase 1 o Fase 2 per un candidato.
 */

import React, { useState } from 'react';
import { reviewCriteria } from '../../config/reviewCriteria'; // Criteri di valutazione
import { submitPhase1Review, submitPhase2Review } from '../../services/candidateService'; // Funzioni per inviare le revisioni

interface ReviewFormProps {
  phase: 1 | 2;
  candidateId: number;
  onSubmitSuccess: () => void; // Callback per notificare il genitore del successo
}

const ReviewForm = ({ phase, candidateId, onSubmitSuccess }: ReviewFormProps) => {
  // Stato per i dati del form
  const [notes, setNotes] = useState('');
  const [criteriaRatings, setCriteriaRatings] = useState<{ [key: string]: number }>({});
  const [finalScore, setFinalScore] = useState<number | ''>('');
  const [hireDecision, setHireDecision] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCriteriaChange = (criteriaId: string, value: number) => {
    setCriteriaRatings(prev => ({ ...prev, [criteriaId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

  try {
      if (phase === 1) {
        await submitPhase1Review(candidateId, { criteriaRatings, notes });
      } else {
        await submitPhase2Review(candidateId, { finalScore, hireDecision, finalComment: notes });
      }
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel salvataggio della revisione.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold">Aggiungi Revisione - Fase {phase}</h3>
      
      {/* Campi specifici per la Fase 1 */}
      {phase === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valutazione Criteri (1-5)</label>
            <div className="space-y-2">
              {reviewCriteria.map(criteria => (
                <div key={criteria.id} className="flex items-center justify-between">
                  <span className="text-gray-800">{criteria.label}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        type="button"
                        key={rating}
                        onClick={() => handleCriteriaChange(criteria.id, rating)}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          criteriaRatings[criteria.id] === rating
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="notes_phase1" className="block text-sm font-medium text-gray-700">Note Aggiuntive</label>
            <textarea
              id="notes_phase1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </>
      )}

      {/* Campi specifici per la Fase 2 */}
      {phase === 2 && (
        <>
          <div>
            <label htmlFor="finalScore" className="block text-sm font-medium text-gray-700">Punteggio Complessivo (1-10)</label>
            <input
              type="number"
              id="finalScore"
              value={finalScore}
              onChange={(e) => setFinalScore(Number(e.target.value))}
              min="1" max="10" step="0.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Decisione Assunzione</label>
            <div className="flex gap-4 mt-1">
              <button type="button" onClick={() => setHireDecision(true)} className={`px-4 py-2 rounded-md ${hireDecision === true ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Sì, Assumere</button>
              <button type="button" onClick={() => setHireDecision(false)} className={`px-4 py-2 rounded-md ${hireDecision === false ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>No, Rifiutare</button>
            </div>
          </div>
          <div>
            <label htmlFor="finalComment" className="block text-sm font-medium text-gray-700">Commento Finale</label>
            <textarea
              id="finalComment"
              value={notes} // Riusiamo lo stato `notes`
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? 'Salvataggio...' : 'Salva Revisione'}
      </button>
    </form>
  );
};

export default ReviewForm;