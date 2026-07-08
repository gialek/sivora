// routes/users.js — Route data users SIPEMIRA

import express from 'express';
import {
  getMahasiswa,
  getMe
} from '../controllers/usersController.js';
import { verifyToken, isPanitia } from '../middleware/auth.js';

const router = express.Router();

router.get('/mahasiswa', verifyToken, isPanitia, getMahasiswa);
router.get('/me',        verifyToken, getMe);

export default router;