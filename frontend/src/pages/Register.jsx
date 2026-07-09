// pages/Register.jsx — Halaman registrasi mahasiswa SIPEMIRA

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [form, setForm] = useState({
    username: '', nim: '', password: '',
    konfirmasi_password: '', tanggal_lahir: ''
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!form.username)             err.username = 'Username wajib diisi';
    if (!form.nim)                  err.nim = 'NIM wajib diisi';
    if (!form.password)             err.password = 'Password wajib diisi';
    if (form.password.length < 6)   err.password = 'Password minimal 6 karakter';
    if (!form.konfirmasi_password)  err.konfirmasi_password = 'Konfirmasi password wajib diisi';
    if (form.password !== form.konfirmasi_password) {
      err.konfirmasi_password = 'Password tidak sama';
    }
    if (!form.tanggal_lahir)        err.tanggal_lahir = 'Tanggal lahir wajib diisi';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) return setErrors(err);

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, form);
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal';
      toast.error(msg);
      if (msg.includes('Username')) setErrors({ username: msg });
      if (msg.includes('NIM'))      setErrors({ nim: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center text-white p-12"
        style={{ backgroundColor: '#1e3a5f' }}>
        <div className="text-center">
          <img
              src="/logo_himasi.png"
              alt="SIPEMIRA"
              className="w-40 h-40 mx-auto mb-4 object-contain"
            />
          <h1 className="text-5xl font-black mb-3 tracking-tight">SIVORA</h1>
          <p className="text-xl font-medium mb-2" style={{ color: '#f5a623' }}>
            Sistem Informasi Voting Raya
          </p>
          <p className="text-lg opacity-80 italic">
            "Suaramu, Masa Depan Jurusan"
          </p>
          <div className="mt-10 bg-white bg-opacity-10 rounded-2xl p-6">
            <p className="font-semibold mb-3">Cara Daftar:</p>
            <div className="text-left space-y-2 text-sm opacity-90">
              <p>Isi data diri dengan lengkap</p>
              <p>Gunakan NIM yang valid</p>
              <p>Password minimal 6 karakter</p>
              <p>Login dan gunakan hak pilihmu!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>SIVORA</h1>
            <p className="text-sm text-gray-500">Sistem Informasi Voting Raya</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e3a5f' }}>
              Daftar Akun
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Khusus mahasiswa yang belum memiliki akun
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input type="text" name="username" value={form.username}
                  onChange={handleChange} placeholder="Buat username unik"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-blue-900'}`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* NIM */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NIM</label>
                <input type="text" name="nim" value={form.nim}
                  onChange={handleChange} placeholder="Nomor Induk Mahasiswa"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.nim ? 'border-red-400' : 'border-gray-200 focus:border-blue-900'}`}
                />
                {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
                <input type="date" name="tanggal_lahir" value={form.tanggal_lahir}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.tanggal_lahir ? 'border-red-400' : 'border-gray-200 focus:border-blue-900'}`}
                />
                {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="Minimal 6 karakter"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-blue-900'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
                <input type="password" name="konfirmasi_password" value={form.konfirmasi_password}
                  onChange={handleChange} placeholder="Ulangi password"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.konfirmasi_password ? 'border-red-400' : 'border-gray-200 focus:border-blue-900'}`}
                />
                {errors.konfirmasi_password && <p className="text-red-500 text-xs mt-1">{errors.konfirmasi_password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-lg transition-all
                  hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: '#1e3a5f' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Memproses...
                  </span>
                ) : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold hover:underline"
                style={{ color: '#f5a623' }}>
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;