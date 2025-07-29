import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Importa anche JwtPayload

// Definiamo un'interfaccia per il nostro payload del token.
// Questo ci aiuta a standardizzare cosa ci aspettiamo di trovare nel token.
interface TokenPayload extends JwtPayload {
  userId: number;
}

// Interfaccia per la richiesta autenticata
export interface AuthRequest extends Request {
  userId?: number;
  apiKeyUsed?: boolean;
}

export const jwtAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Nessun token fornito o formato non valido' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  // 1. CONTROLLO DI SICUREZZA PER IL SEGRETO
  // Verifichiamo che la chiave segreta esista prima di usarla.
  if (!secret) {
    console.error("JWT_SECRET non è definito nel file .env");
    return res.status(500).json({ message: 'Errore di configurazione del server' });
  }

  try {
    // 2. VERIFICA E TYPE GUARD PER IL PAYLOAD
    // Verifichiamo il token. Il risultato è di tipo 'any', quindi dobbiamo controllarlo.
    const decoded = jwt.verify(token as string, secret) as JwtPayload | TokenPayload;

    // Controlliamo che il payload decodificato sia un oggetto e contenga 'userId'.
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      // Ora TypeScript sa che 'decoded' ha una proprietà 'userId'.
      const payload = decoded as TokenPayload;
      req.userId = payload.userId;
      next(); // Passa al prossimo middleware/controller
    } else {
      // Se il token è valido ma non ha la forma che ci aspettiamo
      throw new Error('Token payload non valido');
    }

  } catch (error) {
    // Questo catch gestisce sia token scaduti/malformati sia errori custom
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};