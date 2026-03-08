import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: UserProfile = {
  id: 'user_1',
  username: 'Jean Dupont',
  email: 'user@tubesite.com',
  avatar: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=FFA500&color=fff',
  isPremium: false,
  role: 'user',
};

const MOCK_ADMIN: UserProfile = {
  id: 'admin_1',
  username: 'Super Admin',
  email: 'admin@tubesite.com',
  avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=000&color=fff',
  isPremium: true,
  role: 'admin',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check persistence
    const storedUser = localStorage.getItem('vibetube_user') || sessionStorage.getItem('vibetube_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let authenticatedUser: UserProfile | null = null;

    if (email === 'user@tubesite.com' && password === 'User2024!') {
      authenticatedUser = MOCK_USER;
    } else if (email === 'admin@tubesite.com' && password === 'Admin2024!') {
      authenticatedUser = MOCK_ADMIN;
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('vibetube_user', JSON.stringify(authenticatedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('vibetube_user');
    sessionStorage.removeItem('vibetube_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {!isLoading && children}
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
