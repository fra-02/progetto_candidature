import rateLimit from 'express-rate-limit';

// Limiter per azioni di bot
export const botLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 20, // Aumentato leggermente per evitare problemi di test
  message: 'Troppe richieste da questo IP, riprova più tardi.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter per utenti autenticati
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Stai facendo troppe richieste, attendi un momento.',
  standardHeaders: true,
  legacyHeaders: false,
});