export const theme = {
  colors: {
    // Primary - Vibrant Fitness Blue (Energy + Trust)
    primary: '#0EA5E9',          // Bright cyan blue - energetic
    primaryDark: '#0284C7',       // Deep ocean blue
    primaryLight: '#38BDF8',      // Light sky blue
    primaryLighter: '#E0F2FE',    // Soft blue tint
    
    // Secondary - Energetic Orange (Motivation + Action)
    secondary: '#F97316',         // Vibrant orange
    secondaryDark: '#EA580C',     // Deep orange
    secondaryLight: '#FB923C',    // Light orange
    secondaryLighter: '#FFEDD5',  // Soft peach
    
    // Accent - Fresh Green (Health + Vitality)
    accent: '#10B981',            // Fresh green
    accentDark: '#059669',        // Forest green
    accentLight: '#34D399',       // Light mint
    accentLighter: '#D1FAE5',     // Pale mint
    
    // Neutrals - Modern Gray Scale
    black: '#0F172A',             // Slate black
    gray900: '#1E293B',
    gray800: '#334155',
    gray700: '#475569',
    gray600: '#64748B',
    gray500: '#94A3B8',
    gray400: '#CBD5E1',
    gray300: '#E2E8F0',
    gray200: '#F1F5F9',
    gray100: '#F8FAFC',
    white: '#FFFFFF',
    
    // Semantic Colors
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    bgDark: '#0F172A',
    bgCard: '#FFFFFF',
    bgGradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    bgGradientOrange: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    bgGradientGreen: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    
    // Text
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    textInverse: '#FFFFFF',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    colored: '0 10px 25px -5px rgba(14, 165, 233, 0.3)',
    coloredOrange: '0 10px 25px -5px rgba(249, 115, 22, 0.3)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    xxl: '1.5rem',
    full: '9999px',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
