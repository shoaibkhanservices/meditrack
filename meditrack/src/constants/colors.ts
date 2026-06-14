// ============================================================
// MediTrack Color System — Premium Healthcare Edition
// Aligned with the ui-ux-pro-max-skill guidelines
// ============================================================

export const colors = {
  primary: '#0891B2',       // Calm Cyan/Teal (Medical Brand Color)
  primaryLight: '#ECFEFF',  // Cyan Tint (Bg highlight)
  primaryDark: '#155E75',   // Deep Cyan/Teal
  
  emergency: '#DC2626',     // Alert Red
  urgent: '#EA580C',        // Urgent Orange
  caution: '#CA8A04',       // Caution Gold
  safe: '#059669',          // Health Green

  surface: '#FFFFFF',
  background: '#ECFEFF',    // Fluid Cyan Tint
  border: '#A5F3FC',        // Cyan Border Accent

  textPrimary: '#164E63',   // Deep Teal (Complies with WCAG AAA contrast)
  textSecondary: '#475569', // Muted slate-600
  textOnDark: '#FFFFFF',

  errorBg: '#FEE2E2',
  errorText: '#DC2626',
} as const;

export const urgencyColors = {
  EMERGENCY: {
    bg: '#DC2626',
    text: '#FFFFFF',
    label: 'Emergency',
  },
  SEE_DOCTOR_TODAY: {
    bg: '#EA580C',
    text: '#FFFFFF',
    label: 'See Doctor Today',
  },
  MONITOR_AT_HOME: {
    bg: '#CA8A04',
    text: '#FFFFFF',
    label: 'Monitor at Home',
  },
  ROUTINE_CHECKUP: {
    bg: '#059669',
    text: '#FFFFFF',
    label: 'Routine Checkup',
  },
} as const;

export type UrgencyColorKey = keyof typeof urgencyColors;
