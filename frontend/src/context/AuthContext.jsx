// context/AuthContext.jsx — Context autentikasi global SIPEMIRA

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('sipemira_token');
    const savedUser  = localStorage.getItem('sipemira_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('sipemira_token', tokenData);
    localStorage.setItem('sipemira_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sipemira_token');
    localStorage.removeItem('sipemira_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);