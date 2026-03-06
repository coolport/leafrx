import { useColorScheme } from './use-color-scheme';
import { Colors } from '../constants/theme';

export function useAppTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const theme = {
    isDark,
    colors: {
      background: isDark ? Colors.dark.background : '#f8fafc',
      card: isDark ? '#1e293b' : '#fff',
      text: isDark ? Colors.dark.text : '#1e293b',
      subtext: isDark ? '#94a3b8' : '#64748b',
      border: isDark ? '#334155' : '#f1f5f9',
      primary: '#10b981',
      secondary: isDark ? '#334155' : '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      iconBg: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
    }
  };

  return theme;
}
