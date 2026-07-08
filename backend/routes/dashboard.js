// routes/dashboard.js — Route dashboard panitia SIPEMIRA

import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { verifyToken, isPanitia } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', verifyToken, isPanitia, getDashboardStats);

export default router;