import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario desde el backend si hay token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  // Login: guarda usuario y token
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
  };

  // Logout: borra usuario y token
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}