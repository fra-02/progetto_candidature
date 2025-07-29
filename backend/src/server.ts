/**
 * @file server.ts
 * @description 
 * Punto di ingresso principale del server Express.
 * Qui inizializziamo l'applicazione Express, configuriamo le rotte e
 * gestiamo le variabili d'ambiente.
 * Importiamo i middleware necessari per la gestione delle richieste,
 * come il rate limiting e l'autenticazione tramite API Key.
 */
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});