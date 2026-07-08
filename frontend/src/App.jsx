// App.jsx — Routing utama SIPEMIRA

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login    from './pages/Login';
import Register from './pages/Register';

// Panitia Pages
import PanitiaDashboard  from './pages/panitia/Dashboard';
import PanitiaKandidat   from './pages/panitia/Kandidat';
import PanitiaVoting     from './pages/panitia/Voting';
import PanitiaMahasiswa  from './pages/panitia/Mahasiswa';
import PanitiaStatistik  from './pages/panitia/Statistik';
import PanitiaHasil      from './pages/panitia/Hasil';

// Mahasiswa Pages
import MahasiswaVoting from './pages/mahasiswa/Voting';
import MahasiswaHasil  from './pages/mahasiswa/Hasil';

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'panitia' ? '/panitia/dashboard' : '/mahasiswa/voting'} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={!user ? <Login />    : <Navigate to={user.role === 'panitia' ? '/panitia/dashboard' : '/mahasiswa/voting'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'panitia' ? '/panitia/dashboard' : '/mahasiswa/voting'} />} />

      {/* Panitia */}
      <Route path="/panitia/dashboard"  element={<ProtectedRoute role="panitia"><PanitiaDashboard /></ProtectedRoute>} />
      <Route path="/panitia/kandidat"   element={<ProtectedRoute role="panitia"><PanitiaKandidat /></ProtectedRoute>} />
      <Route path="/panitia/voting"     element={<ProtectedRoute role="panitia"><PanitiaVoting /></ProtectedRoute>} />
      <Route path="/panitia/mahasiswa"  element={<ProtectedRoute role="panitia"><PanitiaMahasiswa /></ProtectedRoute>} />
      <Route path="/panitia/statistik"  element={<ProtectedRoute role="panitia"><PanitiaStatistik /></ProtectedRoute>} />
      <Route path="/panitia/hasil"      element={<ProtectedRoute role="panitia"><PanitiaHasil /></ProtectedRoute>} />

      {/* Mahasiswa */}
      <Route path="/mahasiswa/voting" element={<ProtectedRoute role="mahasiswa"><MahasiswaVoting /></ProtectedRoute>} />
      <Route path="/mahasiswa/hasil"  element={<ProtectedRoute role="mahasiswa"><MahasiswaHasil /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
  position="top-right"
  autoClose={3000}
  style={{maxWidth: '280px'}}
/>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
