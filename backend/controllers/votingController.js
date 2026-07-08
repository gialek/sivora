// controllers/votingController.js — Controller voting SIPEMIRA

import db from '../db.js';

// Kirim voting
export const kirimVoting = async (req, res) => {
  const { kandidat_id } = req.body;
  const user_id = req.user.id;

  if (!kandidat_id) {
    return res.status(400).json({ message: 'Kandidat wajib dipilih' });
  }

  try {
    // Cek sudah voting
    const [user] = await db.query(
      'SELECT sudah_voting FROM users WHERE id = ?', [user_id]
    );
    if (user[0].sudah_voting) {
      return res.status(400).json({ message: 'Anda sudah melakukan voting' });
    }

    // Cek voting aktif
    const [pengaturan] = await db.query('SELECT * FROM pengaturan WHERE id = 1');
    if (!pengaturan[0].voting_aktif) {
      return res.status(400).json({ message: 'Voting belum dibuka' });
    }

    // Cek kandidat ada
    const [kandidat] = await db.query(
      'SELECT id FROM kandidat WHERE id = ?', [kandidat_id]
    );
    if (kandidat.length === 0) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    // Simpan voting
    await db.query(
      'INSERT INTO voting (user_id, kandidat_id) VALUES (?, ?)',
      [user_id, kandidat_id]
    );

    // Update jumlah suara kandidat
    await db.query(
      'UPDATE kandidat SET jumlah_suara = jumlah_suara + 1 WHERE id = ?',
      [kandidat_id]
    );

    // Update status sudah voting
    await db.query(
      'UPDATE users SET sudah_voting = true WHERE id = ?',
      [user_id]
    );

    res.json({ message: 'Voting berhasil!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get hasil voting
export const getHasil = async (req, res) => {
  try {
    const [kandidat] = await db.query(
      'SELECT * FROM kandidat ORDER BY jumlah_suara DESC'
    );
    const [total] = await db.query(
      'SELECT COUNT(*) as total FROM voting'
    );

    const totalSuara = total[0].total;
    const hasil = kandidat.map(k => ({
      ...k,
      persentase: totalSuara > 0
        ? ((k.jumlah_suara / totalSuara) * 100).toFixed(1)
        : '0.0'
    }));

    res.json({ hasil, totalSuara });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset voting
export const resetVoting = async (req, res) => {
  try {
    await db.query('DELETE FROM voting');
    await db.query('UPDATE users SET sudah_voting = false');
    await db.query('UPDATE kandidat SET jumlah_suara = 0');
    res.json({ message: 'Data voting berhasil direset' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};