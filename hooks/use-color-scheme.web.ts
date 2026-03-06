import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();
  const storedDarkMode = useSettingsStore(state => state.darkMode);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    if (storedDarkMode === 'system') {
      return systemColorScheme ?? 'light';
    }
    return storedDarkMode;
  }

  return 'light';
}
