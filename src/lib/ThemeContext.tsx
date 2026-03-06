import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      return (saved as Theme) || 'dark';
    } catch (e) {
      console.error('ThemeContext: localStorage error', e);
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      const body = window.document.body;
      if (theme === 'light') {
        root.classList.add('light');
        body.classList.add('light');
      } else {
        root.classList.remove('light');
        body.classList.remove('light');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    } catch (e) {
      console.error('ThemeContext: effect error', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
