import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  darkMode: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  setDarkMode: (mode: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: 'system',
      notificationsEnabled: true,
      setDarkMode: (mode) => set({ darkMode: mode }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'leafrx-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
