// src/routes/candidateRoutes.ts
import { Router } from 'express';
import { userLimiter, botLimiter } from '../middlewares/rateLimiter';  
import { 
    createCandidate, 
    getCandidates, 
    getCandidateById,
    createPhaseOneReview,
    createPhaseTwoReview,
    updateCandidate,
    deleteCandidate,
    getAvailableTags 
} from '../controllers/candidateController';

import { apiKeyAuth } from '../middlewares/apiKeyAuth';
import { jwtAuth } from '../middlewares/jwtAuth';

const router = Router();

router.post('/', botLimiter, apiKeyAuth, createCandidate);
router.get('/', userLimiter, jwtAuth, getCandidates);
router.get('/tags', userLimiter, jwtAuth, getAvailableTags); // <-- SPOSTATA QUI

router.get('/:id', userLimiter, jwtAuth, getCandidateById);
router.post('/:id/phase-one', userLimiter, jwtAuth, createPhaseOneReview);
router.post('/:id/phase-two', jwtAuth, userLimiter, createPhaseTwoReview);
router.put('/:id', jwtAuth, userLimiter, updateCandidate);
router.delete('/:id', jwtAuth, userLimiter, deleteCandidate);

export default router;