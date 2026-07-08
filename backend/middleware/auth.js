// middleware/auth.js — Middleware autentikasi JWT untuk SIPEMIRA

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verifikasi token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

// Hanya panitia yang boleh akses
export const isPanitia = (req, res, next) => {
  if (req.user.role !== 'panitia') {
    return res.status(403).json({ message: 'Akses ditolak, hanya untuk panitia' });
  }
  next();
};

// Hanya mahasiswa yang boleh akses
export const isMahasiswa = (req, res, next) => {
  if (req.user.role !== 'mahasiswa') {
    return res.status(403).json({ message: 'Akses ditolak, hanya untuk mahasiswa' });
  }
  next();
};
