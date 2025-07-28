/**
 * @file main.tsx
 * @description
 * Punto di ingresso principale dell'applicazione React.
 * Qui inizializziamo l'applicazione, importiamo gli stili globali e
 * renderizziamo il componente principale <App /> all'interno del DOM.
 * Utilizziamo ReactDOM per montare l'applicazione nel nodo con id 'root'.
 * Assicuriamoci che il file index.css sia importato per gli stili globali.
 * Questo file è fondamentale per avviare l'applicazione e renderizzare
 * la struttura di base dell'interfaccia utente.
 */


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Assicurati che questo import sia presente

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)