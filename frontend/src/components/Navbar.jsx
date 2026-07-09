// components/Navbar.jsx — Navbar navigasi mahasiswa SIVORA (responsif)

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout');
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 shadow-md"
        style={{ backgroundColor: '#1e3a5f' }}>
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo_himasi.png" alt="SIVORA"
              className="w-8 h-8 object-contain" />
            <span className="text-white font-black text-lg">SIVORA</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/mahasiswa/voting"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${isActive ? 'text-white' : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10'}`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#f5a623' } : {}}>
              Voting
            </NavLink>
            <NavLink to="/mahasiswa/hasil"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${isActive ? 'text-white' : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10'}`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#f5a623' } : {}}>
              Hasil
            </NavLink>
          </div>

          {/* User Info + Logout Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm font-semibold">Halo, {user?.username}</p>
              <p className="text-white text-xs opacity-60">NIM: {user?.nim}</p>
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                bg-red-500 hover:bg-red-600 transition-all">
              Logout
            </button>
          </div>

          {/* Hamburger Mobile */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Dropdown Mobile */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-white border-opacity-20 pt-3">
            {/* User Info */}
            <div className="text-white text-sm mb-3">
              <p className="font-semibold">Halo, {user?.username}</p>
              <p className="opacity-60 text-xs">NIM: {user?.nim}</p>
            </div>

            <NavLink to="/mahasiswa/voting"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-semibold transition-all
                ${isActive ? 'text-white' : 'text-white text-opacity-70'}`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#f5a623' } : {}}>
              Voting
            </NavLink>

            <NavLink to="/mahasiswa/hasil"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-semibold transition-all
                ${isActive ? 'text-white' : 'text-white text-opacity-70'}`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#f5a623' } : {}}>
              Hasil
            </NavLink>

            <button onClick={handleLogout}
               className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white
    hover:bg-red-500 active:bg-red-600 transition-all text-left">
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;