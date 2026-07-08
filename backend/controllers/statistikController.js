// controllers/statistikController.js — Controller statistik SIPEMIRA

import db from '../db.js';

// Perolehan suara per kandidat
export const getPerolehanSuara = async (req, res) => {
  try {
    const [kandidat] = await db.query(
      'SELECT * FROM kandidat ORDER BY jumlah_suara DESC'
    );
    const [total] = await db.query(
      'SELECT COUNT(*) as total FROM voting'
    );
    const totalSuara = total[0].total;

    const data = kandidat.map(k => ({
      nama        : k.nama,
      jumlah_suara: k.jumlah_suara,
      persentase  : totalSuara > 0
        ? parseFloat(((k.jumlah_suara / totalSuara) * 100).toFixed(1))
        : 0
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Timeline voting per jam
export const getTimelineVoting = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT HOUR(waktu_voting) as jam, COUNT(*) as total
       FROM voting
       GROUP BY HOUR(waktu_voting)
       ORDER BY jam ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Partisipasi mahasiswa
export const getPartisipasi = async (req, res) => {
  try {
    const [total] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'mahasiswa'`
    );
    const [sudah] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'mahasiswa' AND sudah_voting = true`
    );

    const totalMahasiswa = total[0].total;
    const sudahVoting    = sudah[0].total;
    const belumVoting    = totalMahasiswa - sudahVoting;
    const persentase     = totalMahasiswa > 0
      ? parseFloat(((sudahVoting / totalMahasiswa) * 100).toFixed(1))
      : 0;

    res.json({ totalMahasiswa, sudahVoting, belumVoting, persentase });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};