/**
 * @file authController.ts
 * @description
 * Controller per la gestione dell'autenticazione degli utenti.
 * Gestisce la logica di login, verifica delle credenziali e generazione del token JWT.
 * Utilizza Prisma per l'interazione con il database e bcrypt per la gestione delle password.
 * Gestisce anche gli errori di autenticazione e fornisce risposte appropriate.
 * Assicura che le credenziali siano validate e che il token JWT sia generato correttamente.
 * Questo controller è fondamentale per proteggere le rotte dell'applicazione e garantire che solo gli utenti autenticati possano accedere a determinate funzionalità.
 * Utilizza middleware per la gestione degli errori e per la validazione delle richieste.
 * 
 */

import { Request, Response, NextFunction } from 'express'; 
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username e password sono richiesti' });
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        next(error); 
    }
};
