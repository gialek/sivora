// pages/panitia/Kandidat.jsx — Halaman manajemen kandidat SIPEMIRA

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ModalForm = ({ kandidat, onClose, onSuccess, token }) => {
  const [form, setForm]       = useState({
    nama: kandidat?.nama || '',
    nim_kandidat: kandidat?.nim_kandidat || '',
    visi: kandidat?.visi || '',
    misi: kandidat?.misi || '',
  });
  const [foto, setFoto]       = useState(null);
  const [preview, setPreview] = useState(
    kandidat?.foto ? `${API_URL}/uploads/${kandidat.foto}` : null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.nim_kandidat) {
      return toast.error('Nama dan NIM kandidat wajib diisi');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nama',         form.nama);
      fd.append('nim_kandidat', form.nim_kandidat);
      fd.append('visi',         form.visi);
      fd.append('misi',         form.misi);
      if (foto) fd.append('foto', foto);

      if (kandidat) {
        await axios.put(`${API_URL}/api/kandidat/${kandidat.id}`, fd, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kandidat berhasil diupdate');
      } else {
        await axios.post(`${API_URL}/api/kandidat`, fd, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kandidat berhasil ditambahkan');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kandidat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-screen overflow-y-auto animate-fade-in">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold" style={{ color: '#1e3a5f' }}>
            {kandidat ? 'Edit Kandidat' : 'Tambah Kandidat'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preview Foto */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📷</div>
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#1e3a5f' }}>
              Upload Foto
              <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama kabinet</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange}
              placeholder="Nama kabinet kandidat"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pasangan</label>
            <input type="text" name="nim_kandidat" value={form.nim_kandidat} onChange={handleChange}
              placeholder="Nama pasangan kandidat"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Visi</label>
            <textarea name="visi" value={form.visi} onChange={handleChange}
              placeholder="Visi kandidat" rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-900 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Misi</label>
            <textarea name="misi" value={form.misi} onChange={handleChange}
              placeholder="Misi kandidat" rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-blue-900 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-60"
              style={{ backgroundColor: '#1e3a5f' }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Kandidat = () => {
  const [kandidatList, setKandidatList] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [selected, setSelected]         = useState(null);
  const [hapusId, setHapusId]           = useState(null);
  const { token }                       = useAuth();

  const fetchKandidat = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/kandidat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKandidatList(res.data);
    } catch (err) {
      toast.error('Gagal memuat data kandidat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKandidat(); }, []);

  const handleHapus = async () => {
    try {
      await axios.delete(`${API_URL}/api/kandidat/${hapusId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kandidat berhasil dihapus');
      setHapusId(null);
      fetchKandidat();
    } catch (err) {
      toast.error('Gagal menghapus kandidat');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>Manajemen Kandidat</h1>
            <p className="text-gray-500 mt-1">Kelola data kandidat pemilihan</p>
          </div>
          <button
            onClick={() => { setSelected(null); setShowModal(true); }}
            className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
            style={{ backgroundColor: '#1e3a5f' }}>
            Tambah Kandidat
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: '#1e3a5f' }}></div>
          </div>
        ) : kandidatList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-xl font-semibold">Belum ada kandidat</p>
            <p className="text-sm mt-1">Klik "Tambah Kandidat" untuk menambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kandidatList.map((k) => (
              <div key={k.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gray-100">
                  {k.foto ? (
                    <img src={`${API_URL}/uploads/${k.foto}`} alt={k.nama}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">👤</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg" style={{ color: '#1e3a5f' }}>{k.nama}</h3>
                  <p className="text-gray-500 text-sm">Nama Pasangan: {k.nim_kandidat}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold" style={{ color: '#f5a623' }}>
                      🗳️ {k.jumlah_suara} suara
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => { setSelected(k); setShowModal(true); }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: '#0ea5e9' }}>
                      Edit
                    </button>
                    <button
                      onClick={() => setHapusId(k.id)}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <ModalForm
          kandidat={selected}
          onClose={() => setShowModal(false)}
          onSuccess={fetchKandidat}
          token={token}
        />
      )}

      {/* Modal Hapus */}
      {hapusId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Kandidat?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Hapus kandidat ini? Suara yang sudah masuk untuk kandidat ini juga akan terhapus.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setHapusId(null)}
                className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-600">
                Batal
              </button>
              <button onClick={handleHapus}
                className="flex-1 py-2 rounded-xl text-white font-semibold bg-red-500 hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kandidat;