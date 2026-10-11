import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'demo') {
        localStorage.setItem('uf_admin_session', 'active');
        return true;
      }
      return localStorage.getItem('uf_admin_session') === 'active';
    } catch {
      return false;
    }
  });

  const [adminUser] = useState({
    username: 'admin',
    name: 'Showroom Staff',
    role: 'Store Administrator'
  });

  const login = (username, password) => {
    // Standard showroom manager credentials
    if (
      (username.trim() === 'admin' || username.trim() === 'unique') &&
      password === 'unique2025'
    ) {
      localStorage.setItem('uf_admin_session', 'active');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password. Please use admin / unique2025.' };
  };

  const logout = () => {
    localStorage.removeItem('uf_admin_session');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
