import { Request, Response, NextFunction } from 'express'; // <-- Aggiunto NextFunction
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => { // <-- Aggiunto next
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
