export const colors = {
  // Background
  background: '#000000',
  surface: '#0D0D0D',
  surfaceElevated: '#1A1A1A',

  // Glass
  glassBg: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',

  // Status colors
  statusSmooth: '#4ADE80',
  statusProcrastinate: '#FBBF24',
  statusStuck: '#F87171',
  statusDone: '#60A5FA',

  // Ring colors (story colors)
  ringColors: [
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#A855F7', // purple
    '#EC4899', // pink
    '#F43F5E', // rose
    '#F97316', // orange
    '#EAB308', // yellow
    '#22C55E', // green
    '#14B8A6', // teal
    '#06B6D4', // cyan
  ],

  // Accent
  accent: '#6366F1',
  accentLight: '#818CF8',
} as const;

export const statusColors: Record<string, string> = {
  smooth: colors.statusSmooth,
  procrastinate: colors.statusProcrastinate,
  totally_stuck: colors.statusStuck,
  done: colors.statusDone,
};

export const statusLabels: Record<string, string> = {
  smooth: 'Smooth',
  procrastinate: 'Procrastinate',
  totally_stuck: 'Totally Stuck',
  done: 'Done',
};
