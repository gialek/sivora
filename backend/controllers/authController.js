// controllers/authController.js — Controller autentikasi SIPEMIRA

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?', [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, nim: user.nim, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id          : user.id,
        username    : user.username,
        nim         : user.nim,
        role        : user.role,
        sudah_voting: user.sudah_voting
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register (khusus mahasiswa)
export const register = async (req, res) => {
  const { username, nim, password, konfirmasi_password, tanggal_lahir } = req.body;

  if (!username || !nim || !password || !konfirmasi_password || !tanggal_lahir) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password !== konfirmasi_password) {
    return res.status(400).json({ message: 'Password tidak sama' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }

  try {
    // Cek username
    const [cekUsername] = await db.query(
      'SELECT id FROM users WHERE username = ?', [username]
    );
    if (cekUsername.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Cek NIM
    const [cekNim] = await db.query(
      'SELECT id FROM users WHERE nim = ?', [nim]
    );
    if (cekNim.length > 0) {
      return res.status(400).json({ message: 'NIM sudah terdaftar' });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, nim, password, tanggal_lahir, role)
       VALUES (?, ?, ?, ?, 'mahasiswa')`,
      [username, nim, hash, tanggal_lahir]
    );

    res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};