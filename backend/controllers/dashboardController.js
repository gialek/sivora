// controllers/dashboardController.js — Controller dashboard SIPEMIRA

import db from '../db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [kandidat] = await db.query(
      'SELECT COUNT(*) as total FROM kandidat'
    );
    const [mahasiswa] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'mahasiswa'`
    );
    const [suara] = await db.query(
      'SELECT COUNT(*) as total FROM voting'
    );
    const [sudah] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'mahasiswa' AND sudah_voting = true`
    );
    const [pengaturan] = await db.query(
      'SELECT * FROM pengaturan WHERE id = 1'
    );

    const totalMahasiswa = mahasiswa[0].total;
    const sudahVoting    = sudah[0].total;
    const persentase     = totalMahasiswa > 0
      ? parseFloat(((sudahVoting / totalMahasiswa) * 100).toFixed(1))
      : 0;

    res.json({
      totalKandidat  : kandidat[0].total,
      totalMahasiswa,
      totalSuara     : suara[0].total,
      sudahVoting,
      persentase,
      voting_aktif   : pengaturan[0].voting_aktif,
      tampilkan_hasil: pengaturan[0].tampilkan_hasil
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};