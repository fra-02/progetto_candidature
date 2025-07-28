/**
 * @file reducer.ts
 * @description
 * Gestisce lo stato globale dell'applicazione utilizzando un reducer.
 * Questo file definisce lo stato iniziale e la logica per aggiornare lo stato
 * in base alle azioni lanciate.
 * Le azioni principali sono:
 * - FETCH_DATA_START: per indicare l'inizio del caricamento dei dati.
 * - FETCH_DATA_SUCCESS: per aggiornare lo stato con i dati ricevuti dalle API.
 * - FETCH_DATA_FAILURE: per gestire gli errori durante il caricamento dei dati.
 */



import type { AppState, AppAction } from './types';

// Lo stato iniziale della nostra applicazione
export const initialState: AppState = {
  candidates: [],
  availableTags: [],
  isLoading: true,
  error: null,
};

// Il reducer: una funzione pura che calcola il nuovo stato
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'FETCH_DATA_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        isLoading: false,
        candidates: action.payload.candidates,
        availableTags: action.payload.tags,
      };
    case 'FETCH_DATA_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};