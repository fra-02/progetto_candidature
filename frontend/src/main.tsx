// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom'; // <-- Importa il BrowserRouter
import './index.css'; // Stili globali

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Avvolgi l'intera App nel BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);