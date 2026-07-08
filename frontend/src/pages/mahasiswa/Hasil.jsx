// pages/mahasiswa/Hasil.jsx — Halaman hasil voting mahasiswa SIPEMIRA

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Hasil = () => {
  const [hasil, setHasil] = useState([]);
  const [total, setTotal] = useState(0);
  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        axios.get(`${API_URL}/api/voting/hasil`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/pengaturan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setHasil(r1.data.hasil);
      setTotal(r1.data.totalSuara);
      setPengaturan(r2.data);
    } catch (err) {
      toast.error("Gagal memuat hasil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "#1e3a5f" }}
        ></div>
      </div>
    );

  // Kondisi A — Hasil belum diumumkan
  if (!pengaturan?.tampilkan_hasil)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-8xl mb-6"></div>
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: "#1e3a5f" }}
            >
              Hasil Belum Diumumkan
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Panitia belum membuka hasil pemilihan. Pantau terus pengumuman
              resmi.
            </p>
          </div>
        </div>
      </div>
    );

  // Kondisi B — Hasil ditampilkan
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-12 px-4 lg:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black" style={{ color: "#1e3a5f" }}>
            Hasil Pemilihan Ketua & Wakil Ketua Himpunan
          </h1>
          <p className="text-gray-500 mt-2">
            Total suara masuk: <span className="font-bold">{total}</span>
          </p>
        </div>

        {hasil.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🗳️</div>
            <p className="text-xl font-semibold">Belum ada suara masuk</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hasil.map((h, i) => (
              <div
                key={h.id}
                className={`bg-white rounded-2xl shadow-sm border p-6
  ${
    i === 0 && total > 0 && hasil[0].jumlah_suara > hasil[1]?.jumlah_suara
      ? "border-yellow-400 border-2"
      : "border-gray-100"
  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Foto */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {h.foto ? (
                      <img
                        src={`${API_URL}/uploads/${h.foto}`}
                        alt={h.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: "#1e3a5f" }}
                      >
                        {h.nama}
                      </h3>
                      {i === 0 &&
                        total > 0 &&
                        hasil[0].jumlah_suara > hasil[1]?.jumlah_suara && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            Unggul
                          </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      Nama Pasangan: {h.nim_kandidat}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span
                          className="font-semibold"
                          style={{ color: "#1e3a5f" }}
                        >
                          {h.jumlah_suara} suara
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: "#f5a623" }}
                        >
                          {h.persentase}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${h.persentase}%`,
                            backgroundColor: i === 0 ? "#f5a623" : "#1e3a5f",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hasil;
