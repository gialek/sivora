// pages/panitia/Hasil.jsx — Halaman hasil voting panitia SIPEMIRA

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Hasil = () => {
  const [hasil, setHasil] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchHasil = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/voting/hasil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasil(res.data.hasil);
      setTotal(res.data.totalSuara);
    } catch (err) {
      toast.error("Gagal memuat hasil voting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHasil();
  }, []);

  const pemenang = hasil[0];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      hasil.map((h, i) => ({
        No: i + 1,
        "Nama Kabinet": h.nama,
        "Nama Pasangan": h.nim_kandidat,
        "Jumlah Suara": h.jumlah_suara,
        Persentase: `${h.persentase}%`,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil Voting");
    XLSX.writeFile(wb, "SIVORA_Hasil_Voting.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SIVORA", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Sistem Informasi Voting Raya", 105, 23, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")} WIB`, 105, 30, {
      align: "center",
    });
    doc.line(15, 34, 195, 34);

    autoTable(doc, {
      startY: 38,
      head: [
        ["No", "Nama Kabinet", "Nama Pasangan", "Jumlah Suara", "Persentase"],
      ],
      body: hasil.map((h, i) => [
        i + 1,
        h.nama,
        h.nim_kandidat,
        h.jumlah_suara,
        `${h.persentase}%`,
      ]),
      didParseCell: (data) => {
        if (data.row.index === 0 && data.section === "body") {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text(
      `Dicetak oleh Sistem SIVORA pada ${new Date().toLocaleString("id-ID")} WIB`,
      105,
      finalY,
      { align: "center" },
    );
    doc.save("SIVORA_Hasil_Voting.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "#1e3a5f" }}>
              Hasil Voting
            </h1>
            <p className="text-gray-500 mt-1">
              Total suara masuk: <span className="font-bold">{total}</span>
            </p>
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "#1e3a5f" }}
            ></div>
          </div>
        ) : hasil.length === 0 ? (
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
