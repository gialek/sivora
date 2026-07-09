// pages/Login.jsx — Halaman login SIPEMIRA

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.username) err.username = "Username wajib diisi";
    if (!form.password) err.password = "Password wajib diisi";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) return setErrors(err);

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      login(res.data.token, res.data.user);
      toast.success("Login berhasil!");
      if (res.data.user.role === "panitia") {
        navigate("/panitia/dashboard");
      } else {
        navigate("/mahasiswa/voting");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal";
      toast.error(msg);
      if (msg === "Username tidak ditemukan") {
        setErrors({ username: msg });
      } else if (msg === "Password salah") {
        setErrors({ password: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri */}
      <div
        className="hidden lg:flex w-1/2 flex-col items-center justify-center text-white p-12"
        style={{ backgroundColor: "#1e3a5f" }}
      >
        <div className="text-center">
          <div className="mb-6">
            <img
              src="/logo_himasi.png"
              alt="SIPEMIRA"
              className="w-52 h-52 mx-auto mb-4 object-contain"
            />
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tight">SIVORA</h1>
          <p className="text-xl font-medium mb-2" style={{ color: "#f5a623" }}>
            Sistem Informasi Voting Raya
          </p>
          <p className="text-lg opacity-80 italic">
            "Suaramu, Masa Depan Jurusan"
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-black" style={{ color: "#1e3a5f" }}>
              SIVORA
            </h1>
            <p className="text-sm text-gray-500">
              Sistem Informasi Voting Raya
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "#1e3a5f" }}
            >
              Selamat Datang
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Masuk untuk melanjutkan ke SIVORA
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.username ? "border-red-400" : "border-gray-200 focus:border-blue-900"}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all
                    ${errors.password ? "border-red-400" : "border-gray-200 focus:border-blue-900"}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-lg transition-all
                  hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: "#1e3a5f" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: "#f5a623" }}
              >
                Daftar sebagai Mahasiswa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
