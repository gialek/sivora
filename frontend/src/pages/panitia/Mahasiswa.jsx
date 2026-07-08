// pages/panitia/Mahasiswa.jsx — Halaman data mahasiswa SIPEMIRA

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchMahasiswa = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/mahasiswa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMahasiswa(res.data);
    } catch (err) {
      toast.error("Gagal memuat data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const filtered = mahasiswa.filter((m) => {
    if (filter === "sudah") return m.sudah_voting;
    if (filter === "belum") return !m.sudah_voting;
    return true;
  });

  const totalSudah = mahasiswa.filter((m) => m.sudah_voting).length;
  const totalBelum = mahasiswa.length - totalSudah;
  const persentase =
    mahasiswa.length > 0
      ? ((totalSudah / mahasiswa.length) * 100).toFixed(1)
      : 0;

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID");
  };

  const formatWaktu = (waktu) => {
    if (!waktu) return "-";
    return new Date(waktu).toLocaleString("id-ID");
  };

  const exportExcel = () => {
    const data = filtered.map((m, i) => ({
      No: i + 1,
      Username: m.username,
      NIM: m.nim,
      "Tanggal Lahir": formatTanggal(m.tanggal_lahir),
      "Status Voting": m.sudah_voting ? "Sudah Voting" : "Belum Voting",
      "Waktu Vote": formatWaktu(m.waktu_voting),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Mahasiswa");
    XLSX.writeFile(wb, "SIVORA_Data_Mahasiswa.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("SIVORA - Data Mahasiswa", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")} WIB`, 105, 22, {
      align: "center",
    });

    autoTable(doc, {
      startY: 28,
      head: [
        ["No", "Username", "NIM", "Tanggal Lahir", "Status", "Waktu Vote"],
      ],
      body: filtered.map((m, i) => [
        i + 1,
        m.username,
        m.nim,
        formatTanggal(m.tanggal_lahir),
        m.sudah_voting ? "Sudah Voting" : "Belum Voting",
        formatWaktu(m.waktu_voting),
      ]),
    });
    doc.save("SIVORA_Data_Mahasiswa.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: "#1e3a5f" }}>
            Data Mahasiswa
          </h1>
          <p className="text-gray-500 mt-1">
            Pantau partisipasi voting mahasiswa
          </p>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Terdaftar",
              value: mahasiswa.length,
              color: "#1e3a5f",
            },
            { label: "Sudah Voting", value: totalSudah, color: "#10b981" },
            { label: "Belum Voting", value: totalBelum, color: "#ef4444" },
            { label: "Partisipasi", value: `${persentase}%`, color: "#f5a623" },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
            >
              <p className="text-gray-500 text-xs font-medium">{c.label}</p>
              <p
                className="text-2xl font-black mt-1"
                style={{ color: c.color }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter & Export */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            {["semua", "sudah", "belum"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize
                  ${filter === f ? "text-white" : "bg-white text-gray-600 border border-gray-200"}`}
                style={filter === f ? { backgroundColor: "#1e3a5f" } : {}}
              >
                {f === "semua"
                  ? "Semua"
                  : f === "sudah"
                    ? "Sudah Voting"
                    : "Belum Voting"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportExcel}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
            >
              📥 Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: "#1e3a5f" }}
              ></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#1e3a5f" }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold hidden md:table-cell">
                      NIM
                    </th>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold hidden lg:table-cell">
                      Tanggal Lahir
                    </th>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-white text-sm font-semibold hidden lg:table-cell">
                      Waktu Vote
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m, i) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                          {m.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                          {m.nim}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                          {formatTanggal(m.tanggal_lahir)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold
      ${m.sudah_voting ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                          >
                            {m.sudah_voting ? "Sudah" : "Belum"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                          {formatWaktu(m.waktu_voting)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mahasiswa;
