/**
 * @file reviewCriteria.ts
 * @description
 * File di configurazione che definisce i criteri di valutazione per la Fase 1.
 * Centralizzare questa lista in un unico posto rende facile la manutenzione e
 * l'eventuale futura estensione del sistema di revisione.
 */

export interface Criteria {
  id: string;      // L'ID univoco che verrà usato come chiave nel JSON
  label: string;   // L'etichetta che verrà mostrata all'utente
}

// Esportiamo l'array di criteri che verrà usato dal ReviewForm
export const reviewCriteria: Criteria[] = [
  { id: 'technical_skills', label: 'Competenze Tecniche' },
  { id: 'problem_solving', label: 'Capacità di Problem Solving' },
  { id: 'communication', label: 'Comunicazione e Soft Skills' },
  { id: 'culture_fit', label: 'Allineamento Culturale (Culture Fit)' },
  { id: 'teamwork', label: 'Lavoro di Squadra' }
];