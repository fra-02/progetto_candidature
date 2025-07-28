import { Request, Response, NextFunction } from 'express'; // <-- 1. Aggiunto NextFunction
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/jwtAuth';

const prisma = new PrismaClient();

// POST /candidates
export const createCandidate = async (req: Request, res: Response, next: NextFunction) => { // <-- 2. Aggiunto next
    try {
        const { uuid, message_body, sender } = req.body;
        
        const outerBody = JSON.parse(message_body);
        const answers = JSON.parse(outerBody.payload);

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
        next(error);
    }
};

// GET /candidates
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

// GET /candidates/:id
export const getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
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

// POST /candidates/:id/phase-one
export const createPhaseOneReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { grade, notes } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await prisma.review.create({
            data: {
                phase: 1,
                grade,
                notes,
                candidateId: parseInt(id),
                userId: userId,
            },
        });
        res.status(201).json({ status: 'success', message: 'Phase one data saved successfully' });
    } catch (error) {
        next(error);
    }
};

// POST /candidates/:id/phase-two
export const createPhaseTwoReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { final_grade, notes } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        await prisma.review.create({
            data: {
                phase: 2,
                grade: final_grade,
                notes,
                candidateId: parseInt(id),
                userId: userId,
            },
        });
        res.status(201).json({ status: 'success', message: 'Phase two data saved successfully' });
    } catch (error) {
        next(error);
    }
};

// PUT /candidates/:id
export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
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

// DELETE /candidates/:id
export const deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.$transaction(async (tx) => {
            await tx.review.deleteMany({
                where: { candidateId: parseInt(id) },
            });
            
            await tx.candidate.delete({
                where: { id: parseInt(id) },
            });
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

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