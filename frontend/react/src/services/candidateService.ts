/**
 * @file candidateService.ts
 * @description
 * Modulo di servizio per interagire con gli endpoint relativi ai candidati.
 * Ora utilizza il servizio API reale invece di fornire dati mock.
 */

import apiService from './apiService';

// --- Tipi di Dati (DEVONO corrispondere a ciò che l'API restituisce) ---

export interface Tag {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  phase: number;
  // Campi Fase 1
  criteriaRatings: any; // Usiamo 'any' per semplicità, o un oggetto più specifico
  notes: string | null;
  // Campi Fase 2
  finalScore: number | null;
  hireDecision: boolean | null;
  finalComment: string | null;
  // Info relazione
  userId: number;
  createdAt: string;
}

export interface Candidate {
  id: number;
  uuid: string;
  sender: string;
  status: 'pending' | 'reviewed' | 'rejected';
  fullName: string;
  email: string;
  githubLink: string | null;
  rawAnswers: any;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

// --- Funzioni del Servizio ---

/**
 * Recupera la lista completa dei candidati dal backend.
 */
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await apiService.get<Candidate[]>('/candidates');
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei candidati:", error);
    // In caso di errore, restituiamo un array vuoto per non far crashare l'UI.
    return [];
  }
};

/**
 * Recupera la lista di tutti i tag disponibili dal backend.
 */
export const getAvailableTags = async (): Promise<Tag[]> => {
  try {
    // CORREZIONE: Chiama l'endpoint corretto per i tag.
    const response = await apiService.get<Tag[]>('/tags');
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei tag:", error);
    return [];
  }
};

export const getCandidateById = async (id: string): Promise<Candidate | null> => {
  try {
    const response = await apiService.get<Candidate>(`/candidates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Errore nel recupero del candidato con ID ${id}:`, error);
    return null; // In caso di errore, restituiamo null per gestire l'errore nell'UI
  }
};

export const submitPhase1Review = async (candidateId: number, data: any) => {
  return apiService.post(`/candidates/${candidateId}/phase-one`, data);
};

export const submitPhase2Review = async (candidateId: number, data: any) => {
  return apiService.post(`/candidates/${candidateId}/phase-two`, data);
};

export const deleteCandidate = async (candidateId: number): Promise<void> => {
  try {
    await apiService.delete(`/candidates/${candidateId}`);
  } catch (error) {
    console.error(`Errore nella cancellazione del candidato con ID ${candidateId}:`, error);
    throw error; // Rilancia l'errore per gestirlo a livello superiore
  }
};

export const updateCandidate = async (id: number, data: Partial<Candidate>): Promise<Candidate> => {
  try {
    // Invia la richiesta PUT all'endpoint corretto con solo i dati da aggiornare.
    const response = await apiService.put<Candidate>(`/candidates/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Errore nell'aggiornamento del candidato con ID ${id}:`, error);
    throw error;
  }
};