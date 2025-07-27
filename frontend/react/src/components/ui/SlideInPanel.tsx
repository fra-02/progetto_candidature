/**
 * @file SlideInPanel.tsx
 * @description
 * Componente UI riutilizzabile che renderizza un pannello a scomparsa dal lato destro.
 * Usato per mostrare contenuti secondari, come filtri avanzati o form di dettaglio,
 * senza interrompere il flusso principale dell'utente con un modal invasivo.
 * È completamente controllato dal genitore e gestisce la chiusura tramite tasto 'Escape'.
 */

import React, { useEffect } from 'react';

// --- Type Definitions ---
interface SlideInPanelProps {
  /** Controlla se il pannello è visibile o meno. */
  isOpen: boolean;
  /** Callback per chiudere il pannello, invocata dal pulsante 'X' o dal tasto 'Escape'. */
  onClose: () => void;
  /** Il titolo visualizzato nell'header del pannello. */
  title: string;
  /** Il contenuto principale del pannello, passato come children. */
  children: React.ReactNode;
  /** Un nodo React opzionale per il footer, tipicamente usato per pulsanti di azione. */
  footer?: React.ReactNode;
}

// --- Component Definition ---
const SlideInPanel = ({ isOpen, onClose, title, children, footer }: SlideInPanelProps) => {

  // --- Effetto per la gestione del tasto 'Escape' ---
  useEffect(() => {
    // Se il pannello non è aperto, l'effetto non fa nulla.
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Invochiamo la callback fornita dal genitore.
      }
    };

    // Registriamo l'evento a livello di documento per catturare il tasto ovunque.
    document.addEventListener('keydown', handleKeyDown);

    // Funzione di pulizia di React: rimuove l'event listener quando il componente
    // si smonta o quando `isOpen` o `onClose` cambiano, per evitare memory leaks.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Le dipendenze assicurano che l'effetto si aggiorni correttamente.

  return (
    // Contenitore principale del pannello.
    // L'animazione è gestita da classi CSS che applicano una trasformazione (`translate-x`).
    <div
      className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      // --- Attributi di Accessibilità (A11y) ---
      // Indicano che questo elemento si comporta come una finestra di dialogo modale.
      aria-modal="true"
      role="dialog"
      // Collega il titolo del pannello per gli screen reader.
      aria-labelledby="panel-title"
    >
      <div className="flex flex-col h-full">
        
        {/* Header del pannello, contiene il titolo e il pulsante di chiusura. */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          {/* Titolo */}
          <h3 id="panel-title" className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          
          {/* Pulsante di Chiusura */}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Chiudi pannello"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo del Pannello (con scroll verticale automatico se il contenuto è troppo lungo) */}
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>

        {/* Footer del Pannello (renderizzato solo se la prop `footer` è fornita) */}
        {footer && (
          <div className="p-4 border-t bg-gray-50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideInPanel;