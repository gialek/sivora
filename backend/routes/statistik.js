// routes/statistik.js — Route statistik SIPEMIRA

import express from 'express';
import {
  getPerolehanSuara,
  getTimelineVoting,
  getPartisipasi
} from '../controllers/statistikController.js';
import { verifyToken, isPanitia } from '../middleware/auth.js';

const router = express.Router();

router.get('/perolehan-suara',  verifyToken, isPanitia, getPerolehanSuara);
router.get('/timeline-voting',  verifyToken, isPanitia, getTimelineVoting);
router.get('/partisipasi',      verifyToken, isPanitia, getPartisipasi);

export default router;