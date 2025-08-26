
/**
 * A balanced dark theme with neutral grays and selective color accents, optimized for readability and mobile.
 */

// Balanced color palette with reduced blue dominance
export const colors = {
  // Core Colors - Neutral primary with accent blue
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main primary - neutral slate
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    DEFAULT: '#64748b',
  },
  
  // Neutral dark backgrounds with subtle warmth
  background: '#0d1117', // GitHub dark background
  surface: '#161b22', // Cards and panels
  surfaceElevated: '#21262d', // Modals and elevated content
  surfaceHover: '#30363d', // Hover states
  
  // Neutral borders
  border: '#30363d',
  borderLight: '#40464e',
  
  // High contrast text hierarchy
  text: '#f0f6fc', // Primary text - very readable
  textSecondary: '#b1bac4', // Secondary text
  textMuted: '#7d8590', // Muted text
  textDisabled: '#484f58', // Disabled state
  
  // Selective accent colors - less overwhelming
  accent: {
    blue: '#58a6ff', // GitHub blue - primary action color
    cyan: '#39d353', // Green for success actions
    purple: '#a5a5f5', // Subtle purple for special elements
    green: '#3fb950', // Success states
    yellow: '#d29922', // Warnings
    red: '#f85149', // Errors and danger
    orange: '#fd7e14', // Info and highlights
  },

  // Semantic Colors - more accessible
  error: '#f85149', // Clear red for errors
  success: '#3fb950', // Clear green for success
  warning: '#d29922', // Clear yellow for warnings
  info: '#58a6ff', // Blue for information
};

// Enhanced coding fonts for better developer experience
export const fonts = {
  // Primary coding font stack - prioritizes popular developer fonts
  primary: '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", "Consolas", "Liberation Mono", "Courier New", monospace',
  
  // Fallback for UI elements (still monospace for coding feel)
  ui: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // Code-specific font with ligatures
  code: '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", monospace',
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const theme = {
  colors,
  fonts,
};
