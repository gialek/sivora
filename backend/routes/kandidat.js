// routes/kandidat.js — Route manajemen kandidat SIPEMIRA

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getKandidat,
  tambahKandidat,
  editKandidat,
  hapusKandidat
} from '../controllers/kandidatController.js';
import { verifyToken, isPanitia } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Konfigurasi multer untuk upload foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/',     verifyToken, getKandidat);
router.post('/',    verifyToken, isPanitia, upload.single('foto'), tambahKandidat);
router.put('/:id',  verifyToken, isPanitia, upload.single('foto'), editKandidat);
router.delete('/:id', verifyToken, isPanitia, hapusKandidat);

export default router;