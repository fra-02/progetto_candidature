// Import di base
import express, { Request, Response, NextFunction } from 'express'; // <-- Aggiunti i tipi
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import per la gestione errori
import { Prisma } from '@prisma/client'; // <-- Aggiunto per i tipi di errore di Prisma

// Import delle rotte
import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();

// --- MIDDLEWARE GLOBALI ---

// 2. Middleware per il parsing del body JSON delle richieste
app.use(express.json());

// 3. Rate Limiter
const botLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Troppe richieste dal bot, riprova più tardi.' });
const userLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Troppe richieste, riprova più tardi.' });

// --- ROUTING ---

// Limitatori per le rotte 
app.use('/api/auth', userLimiter, authRoutes);
app.use('/api/candidates', botLimiter, candidateRoutes); // Applichiamo il limiter più restrittivo qui


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