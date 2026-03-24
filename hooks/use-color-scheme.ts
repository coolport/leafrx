import { usePlantStore } from "@/store/usePlantStore";

export function useColorScheme() {
  const darkMode = usePlantStore((state) => state.settings.darkMode);
  return darkMode ? "dark" : "light";
}
