// controllers/pengaturanController.js — Controller pengaturan SIPEMIRA

import db from '../db.js';

// Get pengaturan
export const getPengaturan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pengaturan WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Toggle voting aktif
export const toggleVoting = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT voting_aktif FROM pengaturan WHERE id = 1');
    const current = rows[0].voting_aktif;
    await db.query(
      'UPDATE pengaturan SET voting_aktif = ? WHERE id = 1', [!current]
    );
    res.json({ message: 'Status voting diperbarui', voting_aktif: !current });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Toggle tampilkan hasil
export const toggleHasil = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT tampilkan_hasil FROM pengaturan WHERE id = 1');
    const current = rows[0].tampilkan_hasil;
    await db.query(
      'UPDATE pengaturan SET tampilkan_hasil = ? WHERE id = 1', [!current]
    );
    res.json({ message: 'Status hasil diperbarui', tampilkan_hasil: !current });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};