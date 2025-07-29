/**
 * @file app.ts
 * @description
 * Punto di ingresso principale dell'applicazione Express.
 * Qui inizializziamo l'applicazione, configuriamo i middleware e le rotte,
 * e gestiamo le variabili d'ambiente.
 * Importiamo i middleware necessari per la gestione delle richieste,
 * come il rate limiting e l'autenticazione tramite API Key.
 * Questo file è fondamentale per avviare il server e gestire le richieste in arrivo.
 * Assicuriamoci che tutte le rotte siano correttamente configurate e che i middleware
 * siano applicati in modo appropriato per garantire la sicurezza e le prestazioni dell'applicazione.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import { AuthRequest } from './middlewares/jwtAuth'; 

import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// --- MIDDLEWARE GLOBALI ---
app.use(cors());
app.use(express.json());

// --- MIDDLEWARE DI LOGGING SU DATABASE ---
// Questo è l'unico logger che ci serve.
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', async () => {
    const diff = process.hrtime(start);
    const latencyMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
    const authReq = req as AuthRequest;

    try {
      await prisma.requestLog.create({
        data: {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          latencyMs: latencyMs,
          ipAddress: req.ip,
          userId: authReq.userId || null,
          apiKeyUsed: authReq.apiKeyUsed || false,
        },
      });
    } catch (dbError) {
      console.error("Fallimento scrittura log richiesta:", dbError);
    }
  });
  
  next();
});

// --- ROUTING ---

// Limitatori per le rotte 
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes); // Applichiamo il limiter più restrittivo qui


// --- GESTIONE ERRORI GLOBALE ---

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Logghiamo sempre l'errore completo nel terminale per il debug
  console.error(`[ERRORE GLOBALE] Richiesta: ${req.method} ${req.path}\n`, err);

  // Gestione specifica per gli errori noti di Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Errore: la risorsa richiesta per l'update/delete non esiste.
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Operazione fallita: la risorsa non è stata trovata.',
      });
    }
    // Errore: violazione di un vincolo di foreign key.
    if (err.code === 'P2003') {
      const field = err.meta?.field_name || 'un campo correlato';
      return res.status(400).json({
        status: 'error',
        message: `Operazione fallita: l'ID fornito per '${field}' non è valido o non esiste.`,
      });
    }
  }

  // Fallback per tutti gli altri tipi di errore
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});


export default app;