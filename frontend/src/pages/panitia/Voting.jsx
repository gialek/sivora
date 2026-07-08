// pages/panitia/Voting.jsx — Halaman manajemen voting SIPEMIRA

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Voting = () => {
  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [resetText, setResetText]   = useState('');
  const [showReset, setShowReset]   = useState(false);
  const { token }                   = useAuth();

  const fetchPengaturan = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pengaturan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengaturan(res.data);
    } catch (err) {
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPengaturan(); }, []);

  const toggleVoting = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/pengaturan/voting`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengaturan({ ...pengaturan, voting_aktif: res.data.voting_aktif });
      toast.success(`Voting ${res.data.voting_aktif ? 'dibuka' : 'ditutup'}`);
    } catch (err) {
      toast.error('Gagal mengubah status voting');
    }
  };

  const toggleHasil = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/pengaturan/hasil`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengaturan({ ...pengaturan, tampilkan_hasil: res.data.tampilkan_hasil });
      toast.success(`Hasil ${res.data.tampilkan_hasil ? 'ditampilkan' : 'disembunyikan'}`);
    } catch (err) {
      toast.error('Gagal mengubah status hasil');
    }
  };

  const handleReset = async () => {
    if (resetText !== 'RESET') {
      return toast.error('Ketik RESET untuk konfirmasi');
    }
    try {
      await axios.delete(`${API_URL}/api/voting/reset`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Data voting berhasil direset');
      setShowReset(false);
      setResetText('');
    } catch (err) {
      toast.error('Gagal mereset data voting');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>Manajemen Voting</h1>
          <p className="text-gray-500 mt-1">Kelola status dan pengaturan voting</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: '#1e3a5f' }}></div>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">

            {/* Toggle Voting */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: '#1e3a5f' }}>Status Voting</h3>
                  <p className="text-gray-500 text-sm mt-1">Buka atau tutup sesi voting mahasiswa</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${pengaturan?.voting_aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {pengaturan?.voting_aktif ? 'Terbuka' : 'Tertutup'}
                </span>
              </div>
              <button
                onClick={toggleVoting}
                className={`w-full py-3 rounded-xl text-white font-bold transition-all
                  ${pengaturan?.voting_aktif
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'}`}>
                {pengaturan?.voting_aktif ? '🔒' : '🔓'}
              </button>
            </div>

            {/* Toggle Hasil */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: '#1e3a5f' }}>Tampilan Hasil</h3>
                  <p className="text-gray-500 text-sm mt-1">Izinkan mahasiswa melihat hasil voting</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${pengaturan?.tampilkan_hasil ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {pengaturan?.tampilkan_hasil ? 'Ditampilkan' : 'Disembunyikan'}
                </span>
              </div>
              <button
                onClick={toggleHasil}
                className={`w-full py-3 rounded-xl text-white font-bold transition-all
                  ${pengaturan?.tampilkan_hasil
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600'}`}>
                {pengaturan?.tampilkan_hasil ? '🔒' : '🔓'}
              </button>
            </div>

            {/* Reset Voting */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-red-600">Reset Voting</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Hapus semua data voting dan reset suara ke nol. Tidak bisa di-undo.
                </p>
              </div>
              <button
                onClick={() => setShowReset(true)}
                className="w-full py-3 rounded-xl text-white font-bold bg-red-500 hover:bg-red-600 transition-all">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Reset */}
      {showReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Konfirmasi Reset</h3>
            <p className="text-gray-500 text-sm mb-4">
              Ketik <span className="font-black text-red-600">RESET</span> untuk mengkonfirmasi.
              Semua data voting akan dihapus permanen.
            </p>
            <input
              type="text"
              value={resetText}
              onChange={(e) => setResetText(e.target.value)}
              placeholder="Ketik RESET di sini"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none
                focus:border-red-400 mb-4 font-mono"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowReset(false); setResetText(''); }}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-600">
                Batal
              </button>
              <button
                onClick={handleReset}
                disabled={resetText !== 'RESET'}
                className="flex-1 py-2 rounded-xl text-white font-semibold bg-red-500
                  hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;