// controllers/kandidatController.js — Controller kandidat SIPEMIRA

import db from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Get semua kandidat
export const getKandidat = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM kandidat ORDER BY jumlah_suara DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Tambah kandidat
export const tambahKandidat = async (req, res) => {
  const { nama, nim_kandidat, visi, misi } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!nama || !nim_kandidat) {
    return res.status(400).json({ message: 'Nama dan NIM kandidat wajib diisi' });
  }

  try {
    await db.query(
      `INSERT INTO kandidat (nama, nim_kandidat, foto, visi, misi)
       VALUES (?, ?, ?, ?, ?)`,
      [nama, nim_kandidat, foto, visi, misi]
    );
    res.status(201).json({ message: 'Kandidat berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit kandidat
export const editKandidat = async (req, res) => {
  const { id } = req.params;
  const { nama, nim_kandidat, visi, misi } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM kandidat WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    let foto = existing[0].foto;

    // Kalau ada foto baru, hapus foto lama
    if (req.file) {
      if (foto) {
        const oldPath = path.join(__dirname, '../uploads', foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      foto = req.file.filename;
    }

    await db.query(
      `UPDATE kandidat SET nama=?, nim_kandidat=?, foto=?, visi=?, misi=?
       WHERE id=?`,
      [nama, nim_kandidat, foto, visi, misi, id]
    );

    res.json({ message: 'Kandidat berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Hapus kandidat
export const hapusKandidat = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT * FROM kandidat WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    // Hapus foto dari folder uploads
    if (existing[0].foto) {
      const fotoPath = path.join(__dirname, '../uploads', existing[0].foto);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await db.query('DELETE FROM kandidat WHERE id = ?', [id]);
    res.json({ message: 'Kandidat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};