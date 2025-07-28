/**
 * @file types.ts
 * @description
 * Definisce i tipi TypeScript per lo stato globale dell'applicazione.
 * Questi tipi sono utilizzati per garantire la sicurezza dei tipi
 * e migliorare l'autocompletamento in tutto il codice.
 * Includiamo le interfacce per lo stato dell'applicazione e le azioni
 * che possono essere lanciate per modificare lo stato.
 * Questo file è fondamentale per il funzionamento del sistema di gestione dello statoù
 * e per garantire che le azioni siano coerenti con la struttura dei dati.
 */



import type { Candidate, Tag } from '../services/candidateService';

// 1. Definisce la "forma" del nostro stato globale
export interface AppState {
  candidates: Candidate[];
  availableTags: Tag[];
  isLoading: boolean;
  error: string | null;
}

// 2. Definisce tutte le possibili azioni che possiamo lanciare
export type AppAction =

  | { type: 'FETCH_DATA_START' } // Azioni per il caricamento dei dati
  | { type: 'FETCH_DATA_SUCCESS'; payload: { candidates: Candidate[]; tags: Tag[] } } // Azione di successo con i dati ricevuti
  | { type: 'FETCH_DATA_FAILURE'; payload: string }; // Azione di errore con un messaggio