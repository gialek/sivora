// components/Sidebar.jsx — Sidebar navigasi panitia SIVORA (responsif)

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const menuItems = [
  { path: '/panitia/dashboard', label: 'Dashboard'          },
  { path: '/panitia/kandidat',  label: 'Manajemen Kandidat' },
  { path: '/panitia/voting',    label: 'Manajemen Voting'   },
  { path: '/panitia/mahasiswa', label: 'Data Mahasiswa'     },
  { path: '/panitia/statistik', label: 'Statistik & Grafik' },
  { path: '/panitia/hasil',     label: 'Hasil Voting'       },
];

const Sidebar = () => {
  const { logout }       = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout');
    navigate('/login');
  };

  return (
    <>
      {/* Tombol Hamburger — hanya muncul di mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl text-white shadow-lg"
        style={{ backgroundColor: '#1e3a5f' }}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay gelap saat sidebar terbuka di mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 flex flex-col shadow-xl z-50
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `} style={{ backgroundColor: '#1e3a5f' }}>

        {/* Header */}
        <div className="p-6 border-b border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/src/assets/logo_himasi.png" alt="SIVORA"
                className="w-10 h-10 object-contain flex-shrink-0" />
              <div>
                <h1 className="text-white font-black text-lg leading-tight">SIVORA</h1>
                <p className="text-xs opacity-60 text-white">Admin Panitia</p>
              </div>
            </div>
            {/* Tombol tutup sidebar di mobile */}
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-white opacity-70 hover:opacity-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive
                  ? 'text-white'
                  : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#f5a623' } : {}
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white border-opacity-20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-white text-opacity-70 hover:bg-red-500 hover:text-white
              transition-all font-medium text-sm">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;