// pages/panitia/Dashboard.jsx — Halaman dashboard panitia SIPEMIRA

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Kandidat",
          value: stats.totalKandidat,
          icon: "👤",
          color: "#1e3a5f",
        },
        {
          label: "Total Mahasiswa",
          value: stats.totalMahasiswa,
          icon: "🎓",
          color: "#0ea5e9",
        },
        {
          label: "Total Suara Masuk",
          value: stats.totalSuara,
          icon: "🗳️",
          color: "#10b981",
        },
        {
          label: "Partisipasi",
          value: `${stats.persentase}%`,
          icon: "📊",
          color: "#f5a623",
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: "#1e3a5f" }}>
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Ringkasan sistem pemilihan SIVORA
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "#1e3a5f" }}
            ></div>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-end mb-4">
                    <span className="text-3xl">{card.icon}</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">
                    {card.label}
                  </p>
                  <p
                    className="text-3xl font-black mt-1"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress Partisipasi */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-700 mb-3">
                  Progress Partisipasi
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.persentase}%`,
                      backgroundColor: "#f5a623",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{stats.sudahVoting} sudah voting</span>
                  <span>
                    {stats.persentase}% dari {stats.totalMahasiswa} mahasiswa
                  </span>
                </div>
              </div>
            )}

            {/* Status Badge */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium mb-2">
                    Status Voting
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                    ${stats.voting_aktif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${stats.voting_aktif ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {stats.voting_aktif ? "Voting Aktif" : "Voting Tidak Aktif"}
                  </span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium mb-2">
                    Status Hasil
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                    ${stats.tampilkan_hasil ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${stats.tampilkan_hasil ? "bg-green-500" : "bg-gray-400"}`}
                    ></span>
                    {stats.tampilkan_hasil
                      ? "Hasil Ditampilkan"
                      : "Hasil Disembunyikan"}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
