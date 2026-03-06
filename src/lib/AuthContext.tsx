import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/user';
import { UserProfile } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
  toggleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  const toggleLogin = () => setIsLoggedIn(prev => !prev);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, toggleLogin }}>
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
