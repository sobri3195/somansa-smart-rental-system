import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

const createDemoAdmin = () => ({
  id: 1,
  username: 'demo_admin',
  email: 'admin@somansa.demo',
  name: 'Demo Administrator',
  role: 'super_admin',
  isDemo: true,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  lastLogin: new Date().toISOString(),
});

export const AdminProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const demoAdmin = useMemo(() => createDemoAdmin(), []);

  useEffect(() => {
    const savedAdminMode = localStorage.getItem('adminMode');
    if (savedAdminMode === 'true') {
      setIsAdminMode(true);
      setAdminUser(demoAdmin);
    }
  }, [demoAdmin]);

  const loginAdmin = () => {
    setIsAdminMode(true);
    setAdminUser(demoAdmin);
    localStorage.setItem('adminMode', 'true');
    return demoAdmin;
  };

  const logoutAdmin = () => {
    setIsAdminMode(false);
    setAdminUser(null);
    localStorage.removeItem('adminMode');
  };

  const toggleAdminMode = () => {
    if (isAdminMode) {
      logoutAdmin();
    } else {
      loginAdmin();
    }
  };

  const value = {
    isAdminMode,
    adminUser,
    loginAdmin,
    logoutAdmin,
    toggleAdminMode,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
