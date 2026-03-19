import { usePlantStore } from "@/store/usePlantStore";

export function useColorScheme() {
  const settings = usePlantStore((state) => state.settings);
  return settings.darkMode ? "dark" : "light";
}
