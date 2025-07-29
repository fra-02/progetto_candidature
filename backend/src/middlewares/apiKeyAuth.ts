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