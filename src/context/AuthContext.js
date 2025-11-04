// Salve em: src/context/AuthContext.js
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // ✅ Se o usuário for admin, redireciona para o painel administrativo
      if (data.user?.role === 'admin' || data.user?.isAdmin) {
        router.push('/admin/dashboard');
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Falha no login');
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      // Após o registro, chama o login para autenticar
      await login(userData.email, userData.password);
      return data;
    } catch (error) {
      console.error('Erro no registro:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Falha no registro');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export const useAuth = () => {
  return useContext(AuthContext);
};
