// src/routes/candidateRoutes.ts
import { Router } from 'express';
import { 
    createCandidate, 
    getCandidates, 
    getCandidateById,
    createPhaseOneReview,
    createPhaseTwoReview,
    updateCandidate,
    deleteCandidate
} from '../controllers/candidateController';
import { apiKeyAuth } from '../middlewares/apiKeyAuth';
import { jwtAuth } from '../middlewares/jwtAuth';

const router = Router();

// Rotta pubblica per il bot (protetta da API Key)
router.post('/', apiKeyAuth, createCandidate);

// Rotte protette per gli operatori (protette da JWT)
router.get('/', jwtAuth, getCandidates);
router.get('/:id', jwtAuth, getCandidateById);
router.post('/:id/phase-one', jwtAuth, createPhaseOneReview);
router.post('/:id/phase-two', jwtAuth, createPhaseTwoReview);
router.put('/:id', jwtAuth, updateCandidate);
router.delete('/:id', jwtAuth, deleteCandidate);

export default router;