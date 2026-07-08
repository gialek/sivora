// controllers/usersController.js — Controller users SIPEMIRA

import db from '../db.js';

// Get semua mahasiswa
export const getMahasiswa = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.nim, u.tanggal_lahir,
              u.sudah_voting, v.waktu_voting
       FROM users u
       LEFT JOIN voting v ON u.id = v.user_id
       WHERE u.role = 'mahasiswa'
       ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get data user yang sedang login
export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, nim, role, sudah_voting FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};