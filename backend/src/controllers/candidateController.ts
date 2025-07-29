import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { AuthRequest } from '../middlewares/jwtAuth';

const prisma = new PrismaClient();

// POST /api/candidates
// Usato dal bot, protetto da API Key
export const createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uuid, message_body, sender } = req.body;
        
        // Validazione dell'input di base
        if (!uuid || !message_body || !sender) {
            return res.status(400).json({ message: "uuid, message_body, and sender are required." });
        }
        
        const outerBody = JSON.parse(message_body);
        const answers = JSON.parse(outerBody.payload);

        // TODO: Aggiungere logica per collegare i tag durante la creazione
        
        const newCandidate = await prisma.candidate.create({
            data: {
                uuid,
                sender,
                fullName: answers['screen_0_TextInput_0'] || 'N/A',
                email: answers['screen_0_TextInput_1'] || 'N/A',
                githubLink: answers['screen_0_TextInput_4'],
                rawAnswers: answers,
            },
        });

        res.status(201).json({ status: "success", message: "Candidate data saved successfully", candidateId: newCandidate.id });
    } catch (error) {
        next(error); // Invia l'errore al gestore globale
    }
};

// GET /api/candidates
// Per gli operatori autenticati
export const getCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: true,
        tags: true,
      },
    });
    res.json(candidates);
  } catch (error) {
    next(error);
  }
};

// GET /api/candidates/:id
export const getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
      include: { 
        reviews: true,
        tags: true,  
      },
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) { 
    next(error);
  }
};

// POST /api/candidates/:id/phase-one
export const createPhaseOneReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { criteriaRatings, notes } = req.body;
        const userId = req.userId;

        if (!id || !userId) {
            return res.status(400).json({ message: 'Candidate ID and User ID are required' });
        }
        if (!criteriaRatings) {
            return res.status(400).json({ message: 'criteriaRatings are required for a phase 1 review' });
        }

        const review = await prisma.review.create({
            data: {
                phase: 1,
                criteriaRatings, 
                notes,
                candidateId: parseInt(id),
                userId: userId,
            },
        });
        res.status(201).json(review);
    } catch (error) { 
        next(error); 
    }
};

// POST /api/candidates/:id/phase-two
export const createPhaseTwoReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { finalScore, hireDecision, finalComment } = req.body;
        const userId = req.userId;
    
        if (!id || !userId) {
            return res.status(400).json({ message: 'Candidate ID and User ID are required' });
        }
        // Validiamo che i campi obbligatori della fase 2 siano presenti
        if (typeof finalScore !== 'number' || typeof hireDecision !== 'boolean') {
             return res.status(400).json({ message: 'finalScore and hireDecision are required for a phase 2 review' });
        }

        const review = await prisma.review.create({
            data: {
                phase: 2,
                finalScore,
                hireDecision,
                finalComment,
                candidateId: parseInt(id),
                userId: userId,
            },
        });
        res.status(201).json(review);
    } catch (error) { 
        next(error); 
    }
};

// PUT /api/candidates/:id
export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
          return res.status(400).json({ message: 'Candidate ID is required' });
        }

        const { status, fullName, email, githubLink } = req.body;
        const updatedCandidate = await prisma.candidate.update({
            where: { id: parseInt(id) },
            data: {
                status,
                fullName,
                email,
                githubLink,
            },
        });
        res.json(updatedCandidate);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/candidates/:id
export const deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
          return res.status(400).json({ message: 'Candidate ID is required' });
        }

        // Usiamo una transazione per assicurare che o entrambe le operazioni
        // hanno successo, o nessuna delle due.
        await prisma.$transaction(async (tx) => {
            const typedTx = tx as Prisma.TransactionClient;
            // Prima cancelliamo i record dipendenti (le revisioni)
            await typedTx.review.deleteMany({
                where: { candidateId: parseInt(id) },
            });
            // Poi cancelliamo il record principale (il candidato)
            await typedTx.candidate.delete({
                where: { id: parseInt(id) },
            });
        });

        // 204 No Content è la risposta standard per un DELETE riuscito.
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// GET /api/tags
export const getAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(tags);
  } catch (error) {
    next(error);
  }
};