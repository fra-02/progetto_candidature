/**
 * @file apiKeyAuth.ts
 * @description
 * Middleware per l'autenticazione tramite API Key.
 * Questo middleware verifica la presenza di una chiave API nell'header della richiesta.
 * Se la chiave è valida, consente l'accesso alla risorsa richiesta.
 * Altrimenti, restituisce un errore 401 Unauthorized.
 * Utilizza un tipo di richiesta personalizzato per includere un campo `apiKeyUsed
 * che indica se la chiave API è stata utilizzata.
 * 
 */

import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './jwtAuth';

export const apiKeyAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey && apiKey === process.env.API_KEY) {
        req.apiKeyUsed = true; 
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
};