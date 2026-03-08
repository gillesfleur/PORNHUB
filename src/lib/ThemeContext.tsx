import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
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
      
      const applyTheme = (t: 'dark' | 'light') => {
        if (t === 'light') {
          root.classList.add('light');
          body.classList.add('light');
        } else {
          root.classList.remove('light');
          body.classList.remove('light');
        }
      };

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        applyTheme(systemTheme);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        const handleChange = (e: MediaQueryListEvent) => {
          applyTheme(e.matches ? 'light' : 'dark');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        applyTheme(theme);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    } catch (e) {
      console.error('ThemeContext: effect error', e);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
