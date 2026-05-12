import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  error: string;
  success: string;
  border: string;
  cellSelected: string;
  cellHighlight: string;
  cellInitial: string;
  cellUser: string;
}

const lightColors: ThemeColors = {
  background: '#FFF5F7', // Soft pink background
  surface: '#FFFFFF',
  text: '#4A0E2E', // Deep wine text
  textSecondary: '#9F5F80',
  primary: '#FF4D94', // Vibrant pink
  secondary: '#7B61FF', // Retro purple
  error: '#FF2E2E',
  success: '#00D1FF', // Retro cyan/blue
  border: '#FFB3D1',
  cellSelected: '#FFD1E3',
  cellHighlight: '#FFF0F5',
  cellInitial: '#4A0E2E',
  cellUser: '#FF4D94',
};

const darkColors: ThemeColors = {
  background: '#1A0B16', // Deep space cherry
  surface: '#2D132C',
  text: '#FFE4F3',
  textSecondary: '#B07D9A',
  primary: '#FF007F', // Neon pink
  secondary: '#00F0FF', // Cyber cyan
  error: '#FF3131',
  success: '#39FF14', // Neon green
  border: '#800040',
  cellSelected: '#4D0026',
  cellHighlight: '#2D132C',
  cellInitial: '#FFE4F3',
  cellUser: '#FF007F',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  emojiProgress: boolean;
  setEmojiProgress: (val: boolean) => void;
  animateFinishedAreas: boolean;
  setAnimateFinishedAreas: (val: boolean) => void;
  animateFinishedLevels: boolean;
  setAnimateFinishedLevels: (val: boolean) => void;
  highlightDuplicates: boolean;
  setHighlightDuplicates: (val: boolean) => void;
  highlightAreas: boolean;
  setHighlightAreas: (val: boolean) => void;
  highlightIdenticalNumbers: boolean;
  setHighlightIdenticalNumbers: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [emojiProgress, setEmojiProgress] = useState(true);
  const [animateFinishedAreas, setAnimateFinishedAreas] = useState(true);
  const [animateFinishedLevels, setAnimateFinishedLevels] = useState(true);
  const [highlightDuplicates, setHighlightDuplicates] = useState(true);
  const [highlightAreas, setHighlightAreas] = useState(true);
  const [highlightIdenticalNumbers, setHighlightIdenticalNumbers] = useState(true);

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ 
      mode, colors, setMode, isDark, 
      emojiProgress, setEmojiProgress,
      animateFinishedAreas, setAnimateFinishedAreas,
      animateFinishedLevels, setAnimateFinishedLevels,
      highlightDuplicates, setHighlightDuplicates,
      highlightAreas, setHighlightAreas,
      highlightIdenticalNumbers, setHighlightIdenticalNumbers
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
