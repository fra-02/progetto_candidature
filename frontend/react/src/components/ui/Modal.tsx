/**
 * @file Modal.tsx
 * @description
 * Componente UI riutilizzabile per mostrare contenuti in una finestra modale.
 * Appare al centro dello schermo con un overlay scuro e gestisce la chiusura
 * al click sull'overlay o con il tasto 'Escape'.
 */

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) {
    return null;
  }

  return (
    // Contenitore principale a schermo intero con overlay
    <div
      className="fixed inset-0 bg-white shadow-2xl z-50 flex items-center justify-center p-4 transition-opacity"
      // Chiude il modale se si clicca sullo sfondo
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Contenitore del contenuto del modale */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 flex flex-col"
        // Impedisce che il click sul modale si propaghi all'overlay e lo chiuda
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modale */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Chiudi modale"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo del Modale (contenuto dinamico) */}
        <div className="p-6 flex-grow">
          {children}
        </div>

        {/* Footer del Modale (se fornito) */}
        {footer && (
          <div className="p-4 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;