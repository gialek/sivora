// routes/pengaturan.js — Route pengaturan sistem SIPEMIRA

import express from 'express';
import {
  getPengaturan,
  toggleVoting,
  toggleHasil
} from '../controllers/pengaturanController.js';
import { verifyToken, isPanitia } from '../middleware/auth.js';

const router = express.Router();

router.get('/',         verifyToken, getPengaturan);
router.put('/voting',   verifyToken, isPanitia, toggleVoting);
router.put('/hasil',    verifyToken, isPanitia, toggleHasil);

export default router;