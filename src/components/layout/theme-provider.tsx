import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'manual' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';
const MODE_KEY = 'theme-mode';

// Check if current time is during dark hours (8 PM - 6 AM)
const isDarkHours = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 6;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme;
      const savedMode = localStorage.getItem(MODE_KEY) as ThemeMode;
      
      if (savedMode === 'auto') {
        return isDarkHours() ? 'dark' : 'light';
      }
      
      return savedTheme || 'light';
    }
    return 'light';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(MODE_KEY) as ThemeMode) || 'manual';
    }
    return 'manual';
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Auto-schedule theme switching
  useEffect(() => {
    if (themeMode !== 'auto') return;

    // Check and update theme immediately
    const updateAutoTheme = () => {
      const shouldBeDark = isDarkHours();
      setTheme(prev => {
        const newTheme = shouldBeDark ? 'dark' : 'light';
        return prev !== newTheme ? newTheme : prev;
      });
    };

    // Check every minute for theme changes
    const interval = setInterval(updateAutoTheme, 60000);
    
    // Also check on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateAutoTheme();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    // Switching manually overrides auto mode
    if (themeMode === 'auto') {
      setThemeModeState('manual');
      localStorage.setItem(MODE_KEY, 'manual');
    }
  }, [themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(MODE_KEY, mode);
    
    if (mode === 'auto') {
      // Immediately apply auto theme
      setTheme(isDarkHours() ? 'dark' : 'light');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
