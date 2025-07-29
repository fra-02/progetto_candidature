import express, { Request, Response, NextFunction } from 'express'; // Importa express e i tipi Request, Response, NextFunction
import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';                    // Importa Prisma per gestire gli errori specifici
import cors from 'cors';                                    // Import delle rotte
import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();

// --- MIDDLEWARES ---
// 1. Middleware per abilitare CORS
app.use(cors());

// 2. Middleware per il parsing del body JSON delle richieste
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[REQUEST LOGGER] --- Method: ${req.method}, URL: ${req.originalUrl}`);
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