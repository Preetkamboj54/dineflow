import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        return JSON.parse(atob(savedToken.split('.')[1]));
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // Sync token across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isLoggedIn = !!token;
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
