import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        credentials: 'include', // IMPORTANT: Send cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    // Redirect to backend login endpoint
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const logout = async () => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}