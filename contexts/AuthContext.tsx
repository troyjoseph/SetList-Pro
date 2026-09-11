
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically log in a default user to bypass the login flow
    const defaultUser = { id: 'local-user', email: 'local@aisetlist.app', name: 'Admin' };
    setUser(defaultUser);
    setLoading(false);
  }, []);

  const login = async (password: string) => {
    // Login is now a no-op or can be removed, but keeping it for compatibility
    const loggedInUser = { id: 'local-user', email: 'local@aisetlist.app', name: 'Admin' };
    setUser(loggedInUser);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('setlist_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
