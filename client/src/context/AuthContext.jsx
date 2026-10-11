import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize state with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Check current session validity on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          if (data && data.data) {
            setUser(data.data);
          }
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  // --- OTP Auth Methods ---

  const sendRegisterOtp = async (name, mobile) => {
    try {
      const response = await api.post('/auth/register/send-otp', { name, mobile });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return { success: false, message };
    }
  };

  const verifyRegisterOtp = async (mobile, otp) => {
    try {
      const response = await api.post('/auth/register/verify-otp', { mobile, otp });
      const { data, token: receivedToken } = response.data;

      setUser(data);
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(data));

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, message };
    }
  };

  const sendLoginOtp = async (mobile) => {
    try {
      const response = await api.post('/auth/login/send-otp', { mobile });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return { success: false, message };
    }
  };

  const verifyLoginOtp = async (mobile, otp) => {
    try {
      const response = await api.post('/auth/login/verify-otp', { mobile, otp });
      const { data, token: receivedToken } = response.data;

      setUser(data);
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(data));

      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        sendRegisterOtp,
        verifyRegisterOtp,
        sendLoginOtp,
        verifyLoginOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
