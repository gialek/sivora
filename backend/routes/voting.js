// routes/voting.js — Route voting SIPEMIRA

import express from 'express';
import {
  kirimVoting,
  getHasil,
  resetVoting
} from '../controllers/votingController.js';
import { verifyToken, isPanitia, isMahasiswa } from '../middleware/auth.js';

const router = express.Router();

router.post('/',        verifyToken, isMahasiswa, kirimVoting);
router.get('/hasil',    verifyToken, getHasil);
router.delete('/reset', verifyToken, isPanitia, resetVoting);

export default router;