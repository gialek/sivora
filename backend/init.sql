-- =============================================
-- init.sql — Inisialisasi database SIPEMIRA
-- Jalankan sekali untuk setup awal database
-- =============================================

USE sipemira_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  nim VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tanggal_lahir DATE NULL,
  role ENUM('panitia', 'mahasiswa') NOT NULL DEFAULT 'mahasiswa',
  sudah_voting BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel kandidat
CREATE TABLE IF NOT EXISTS kandidat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  nim_kandidat VARCHAR(20) NOT NULL,
  foto VARCHAR(255),
  visi TEXT,
  misi TEXT,
  jumlah_suara INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel voting
CREATE TABLE IF NOT EXISTS voting (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  kandidat_id INT NOT NULL,
  waktu_voting TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (kandidat_id) REFERENCES kandidat(id) ON DELETE CASCADE
);

-- Tabel pengaturan (hanya 1 baris)
CREATE TABLE IF NOT EXISTS pengaturan (
  id INT NOT NULL DEFAULT 1,
  tampilkan_hasil BOOLEAN NOT NULL DEFAULT false,
  voting_aktif BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

-- Seed: akun panitia (password: admin123)
-- Hash bcrypt dari "admin123" rounds=10
INSERT IGNORE INTO users (username, nim, password, tanggal_lahir, role)
VALUES (
  'admin',
  '000000000',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NULL,
  'panitia'
);

-- Seed: pengaturan default
INSERT IGNORE INTO pengaturan (id, tampilkan_hasil, voting_aktif)
VALUES (1, false, false);