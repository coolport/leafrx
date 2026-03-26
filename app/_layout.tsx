import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { initDatabase } from "../services/database";
import { usePlantStore } from "../store/usePlantStore";
import { notificationService } from "../services/notifications";

import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeStore = usePlantStore((state) => state.initialize);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await initializeStore();

        // After hydration, check if notifications are enabled and ensure permissions
        const state = usePlantStore.getState();
        if (state.settings.notifications) {
          await notificationService.requestPermissions();
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    }
    setup();
  }, [initializeStore]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="plant/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="disease/[name]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
