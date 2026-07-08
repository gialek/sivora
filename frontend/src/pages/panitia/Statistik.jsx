// pages/panitia/Statistik.jsx — Halaman statistik & grafik SIPEMIRA

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie, Legend, AreaChart, Area,
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
const COLORS   = ['#1e3a5f', '#f5a623', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444'];

const Statistik = () => {
  const [perolehan,  setPerolehan]  = useState([]);
  const [timeline,   setTimeline]   = useState([]);
  const [partisipasi, setPartisipasi] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const { token } = useAuth();

  const fetchAll = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([
        axios.get(`${API_URL}/api/statistik/perolehan-suara`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/statistik/timeline-voting`,  { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/statistik/partisipasi`,      { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setPerolehan(r1.data);
      setTimeline(r2.data.map(t => ({ ...t, jam: `${String(t.jam).padStart(2,'0')}:00` })));
      setPartisipasi(r3.data);
    } catch (err) {
      toast.error('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const piePartisipasi = partisipasi ? [
    { name: 'Sudah Voting', value: partisipasi.sudahVoting,  fill: '#10b981' },
    { name: 'Belum Voting', value: partisipasi.belumVoting,  fill: '#d1d5db' },
  ] : [];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      perolehan.map((p, i) => ({
        No           : i + 1,
        'Nama Kandidat': p.nama,
        'Jumlah Suara': p.jumlah_suara,
        'Persentase'  : `${p.persentase}%`,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Perolehan Suara');
    XLSX.writeFile(wb, 'SIVORA_Statistik.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('SIVORA - Statistik Voting', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')} WIB`, 105, 22, { align: 'center' });
    autoTable(doc, {
      startY: 28,
      head: [['No', 'Nama Kandidat', 'Jumlah Suara', 'Persentase']],
      body: perolehan.map((p, i) => [i + 1, p.nama, p.jumlah_suara, `${p.persentase}%`]),
    });
    doc.save('SIVORA_Statistik.pdf');
  };

  const isEmpty = perolehan.length === 0 || perolehan.every(p => p.jumlah_suara === 0);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="text-6xl mb-4"></div>
      <p className="text-lg font-semibold">Belum ada data voting saat ini</p>
      <p className="text-sm mt-1">nungguin yah?</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#1e3a5f' }}>Statistik & Grafik</h1>
            <p className="text-gray-500 mt-1">Visualisasi data pemilihan</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExcel}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700">
              📥 Export Excel
            </button>
            <button onClick={exportPDF}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700">
              📄 Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: '#1e3a5f' }}></div>
          </div>
        ) : (
          <>
            {/* Cards */}
            {partisipasi && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Mahasiswa',   value: partisipasi.totalMahasiswa, color: '#1e3a5f' },
                  { label: 'Total Suara Masuk', value: partisipasi.sudahVoting,    color: '#10b981' },
                  { label: 'Belum Voting',      value: partisipasi.belumVoting,    color: '#ef4444' },
                  { label: 'Partisipasi',       value: `${partisipasi.persentase}%`, color: '#f5a623' },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                    <p className="text-gray-500 text-xs font-medium">{c.label}</p>
                    <p className="text-2xl font-black mt-1" style={{ color: c.color }}>{c.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1e3a5f' }}>
                Perolehan Suara per Kandidat
              </h3>
              {isEmpty ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={perolehan} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="nama" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} suara (${props.payload.persentase}%)`, 'Perolehan'
                      ]}
                    />
                    <Bar dataKey="jumlah_suara" radius={[8, 8, 0, 0]}
                      label={{ position: 'top', formatter: (v) => `${v}`, fontSize: 12 }}>
                      {perolehan.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart Suara + Pie Chart Partisipasi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Pie Suara */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: '#1e3a5f' }}>
                  Distribusi Suara
                </h3>
                {isEmpty ? <EmptyState /> : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={perolehan} dataKey="jumlah_suara" nameKey="nama"
                        cx="50%" cy="50%" outerRadius={80} label={({ name, persentase }) => `${name} ${persentase}%`}>
                        {perolehan.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} suara`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie Partisipasi */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: '#1e3a5f' }}>
                  Partisipasi Mahasiswa
                </h3>
                {!partisipasi || partisipasi.totalMahasiswa === 0 ? <EmptyState /> : (
                  <>
                    <div className="text-center mb-2 text-sm text-gray-500">
                      {partisipasi.sudahVoting} dari {partisipasi.totalMahasiswa} mahasiswa
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={piePartisipasi} dataKey="value" nameKey="name"
                          cx="50%" cy="50%" outerRadius={80}>
                          {piePartisipasi.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} mahasiswa`]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </div>

            {/* Area Chart Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1e3a5f' }}>
                Timeline Voting per Jam
              </h3>
              {timeline.length === 0 ? <EmptyState /> : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="jam" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(v) => [`${v} suara`]} />
                    <Area type="monotone" dataKey="total" stroke="#1e3a5f"
                      fill="#1e3a5f" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistik;