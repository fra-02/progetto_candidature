/**
 * @file context.tsx
 * @description
 * Questo file definisce il contesto globale dell'applicazione React.
 * Utilizziamo il Context API di React per gestire lo stato globale e le azioni
 * che possono essere lanciate per modificare lo stato.
 * Il contesto include:
 * - AppState: la forma dello stato globale dell'applicazione.
 * - AppAction: le azioni che possono essere lanciate per modificare lo stato.
 * - AppProvider: un componente che avvolge l'applicazione e fornisce lo stato e il dispatch.
 * - useAppState e useAppDispatch: hook personalizzati per accedere facilmente allo stato
*/


import React, { createContext, useReducer, useContext } from 'react';
import type { Dispatch } from 'react';
import { appReducer, initialState } from './reducer';
import type { AppState, AppAction } from './types';

// Creiamo due contesti: uno per lo stato e uno per la funzione 'dispatch'
const AppStateContext = createContext<AppState>(initialState);
const AppDispatchContext = createContext<Dispatch<AppAction>>(() => null);

// Il componente Provider che avvolgerà la nostra app
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Hook personalizzati per accedere facilmente allo stato e al dispatch
export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);