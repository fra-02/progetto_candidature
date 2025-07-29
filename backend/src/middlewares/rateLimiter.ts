/**
 * @file rateLimiter.ts
 * @description
 * Middleware per limitare il numero di richieste da parte degli utenti e dei bot.
 * Utilizza express-rate-limit per implementare i limiti di richiesta.
 * Gestisce due tipi di limiti:
 * 1. Limite per le azioni dei bot, che sono più restrittive
 * 2. Limite per gli utenti autenticati, che hanno un limite più alto.
 */

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