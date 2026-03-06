import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const storedDarkMode = useSettingsStore(state => state.darkMode);

  if (storedDarkMode === 'system') {
    return systemColorScheme ?? 'light';
  }
  return storedDarkMode;
}
