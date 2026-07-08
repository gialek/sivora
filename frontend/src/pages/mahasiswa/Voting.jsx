// pages/mahasiswa/Voting.jsx — Halaman voting mahasiswa SIPEMIRA

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Voting = () => {
  const [kandidat,    setKandidat]    = useState([]);
  const [pengaturan,  setPengaturan]  = useState(null);
  const [userStatus,  setUserStatus]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [showModal,   setShowModal]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [expandVisi,  setExpandVisi]  = useState({});
  const [expandMisi,  setExpandMisi]  = useState({});
  const { token, user } = useAuth();

  const fetchData = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([
        axios.get(`${API_URL}/api/kandidat`,    { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/pengaturan`,  { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/users/me`,    { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setKandidat(r1.data);
      setPengaturan(r2.data);
      setUserStatus(r3.data);
    } catch (err) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleVisi = (id) => setExpandVisi(p => ({ ...p, [id]: !p[id] }));
  const toggleMisi = (id) => setExpandMisi(p => ({ ...p, [id]: !p[id] }));

  const handlePilih = (k) => {
    setSelected(k);
    setShowModal(true);
  };

  const handleKonfirmasi = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/voting`,
        { kandidat_id: selected.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Suara berhasil dicatat!');
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal melakukan voting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2"
        style={{ borderColor: '#1e3a5f' }}></div>
    </div>
  );

  // Kondisi A — Voting belum dibuka
  if (!pengaturan?.voting_aktif) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-6"></div>
          <h2 className="text-3xl font-black mb-3" style={{ color: '#1e3a5f' }}>
            Pemilihan Belum Dibuka
          </h2>
          <p className="text-gray-500 text-lg">
            Tunggu informasi resmi dari panitia.
          </p>
        </div>
      </div>
    </div>
  );

  // Kondisi B — Sudah voting
  if (userStatus?.sudah_voting) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-xl font-black mb-3" style={{ color: '#1e3a5f' }}>
            Suara Anda Telah Tercatat!
          </h2>
          <p className="text-gray-500 text-lg max-w-md">
            Terima kasih telah berpartisipasi dalam pemilihan Ketua & Wakil Ketua Himpunan.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full
            bg-green-100 text-green-700 font-semibold">
            <span></span>Suara sudah dikirim
          </div>
        </div>
      </div>
    </div>
  );

  // Kondisi C — Voting aktif & belum voting
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 lg:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>
            Pilih Kandidat Ketua & Wakil Ketua Himpunan
          </h1>
          <p className="text-gray-500 mt-2">
            Pilih dengan bijak. Suara tidak dapat diubah setelah dikonfirmasi.
          </p>
        </div>

        {kandidat.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-xl font-semibold">Belum ada kandidat terdaftar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kandidat.map((k) => (
              <div key={k.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                  hover:shadow-md transition-shadow">

                {/* Foto */}
                <div className="h-52 bg-gray-100">
                  {k.foto ? (
                    <img src={`${API_URL}/uploads/${k.foto}`} alt={k.nama}
                      className="w-full h-full object-cover rounded-t-2xl" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">👤</div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-black text-xl" style={{ color: '#1e3a5f' }}>{k.nama}</h3>
                  <p className="text-gray-500 text-sm mb-4">Nama Pasangan: {k.nim_kandidat}</p>

                  {/* Visi */}
                  {k.visi && (
                    <div className="mb-3">
                      <button onClick={() => toggleVisi(k.id)}
                        className="flex items-center gap-2 text-sm font-semibold w-full text-left"
                        style={{ color: '#1e3a5f' }}>
                        <span>Visi</span>
                        <span>{expandVisi[k.id] ? '▲' : '▼'}</span>
                      </button>
                      {expandVisi[k.id] && (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{k.visi}</p>
                      )}
                    </div>
                  )}

                  {/* Misi */}
                  {k.misi && (
                    <div className="mb-4">
                      <button onClick={() => toggleMisi(k.id)}
                        className="flex items-center gap-2 text-sm font-semibold w-full text-left"
                        style={{ color: '#1e3a5f' }}>
                        <span>Misi</span>
                        <span>{expandMisi[k.id] ? '▲' : '▼'}</span>
                      </button>
                      {expandMisi[k.id] && (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{k.misi}</p>
                      )}
                    </div>
                  )}

                  <button onClick={() => handlePilih(k)}
                    className="w-full py-3 rounded-xl text-white font-bold transition-all
                      hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#1e3a5f' }}>
                  Pilih Kandidat Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">🗳️</div>
              <h3 className="text-lg font-black" style={{ color: '#1e3a5f' }}>
                Konfirmasi Pilihan
              </h3>
            </div>
            <p className="text-gray-600 text-sm text-center mb-6">
              Anda akan memilih{' '}
              <span className="font-bold" style={{ color: '#1e3a5f' }}>{selected.nama}</span>{' '}
              sebagai Ketua & Wakil Ketua Himpunan. Pilihan tidak dapat diubah setelah dikonfirmasi.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600">
                Batal
              </button>
              <button onClick={handleKonfirmasi} disabled={submitting}
                className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {submitting ? 'Mengirim...' : 'Ya, Pilih'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;