import { create } from "zustand";
import { Plant, ScanResult, PlantJournalEntry } from "../components/leafrx/types";
import { dbService } from "../services/database";
import { Language } from "../constants/translations";
import { normalizeHealthStatus } from "../constants/health";

interface PlantState {
  plants: Plant[];
  scans: ScanResult[];
  plantEntries: PlantJournalEntry[];
  isHydrated: boolean;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    language: Language;
    showTimelineImages: boolean;
  };
  initialize: () => Promise<void>;
  addPlant: (plant: Omit<Plant, "id" | "entries" | "healthTrend">) => Promise<void>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  addScan: (scan: ScanResult) => Promise<void>;
  addPlantEntry: (entry: Omit<PlantJournalEntry, "id" | "date">) => Promise<void>;
  getPlantScans: (plantId: string) => ScanResult[];
  getPlantEntries: (plantId: string) => PlantJournalEntry[];
  updateSettings: (settings: Partial<PlantState["settings"]>) => Promise<void>;
}

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: [],
  scans: [],
  plantEntries: [],
  isHydrated: false,
  settings: {
    notifications: true,
    darkMode: true,
    language: "en",
    showTimelineImages: false,
  },

  initialize: async () => {
    try {
      const [dbPlants, dbScans, dbPlantEntries, notifications, darkMode, language, showTimelineImages] = await Promise.all([
        dbService.getAllPlants(),
        dbService.getAllScans(),
        dbService.getAllPlantEntries(),
        dbService.getSetting("notifications", true),
        dbService.getSetting("darkMode", true),
        dbService.getSetting("language", "en"),
        dbService.getSetting("showTimelineImages", false),
      ]);
      set({
        plants: dbPlants,
        scans: dbScans,
        plantEntries: dbPlantEntries,
        settings: { notifications, darkMode, language, showTimelineImages },
        isHydrated: true,
      });
    } catch (error) {
      console.error("Failed to hydrate store from SQLite:", error);
      set({ isHydrated: true });
    }
  },

  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...newSettings };

    set({ settings: updatedSettings });

    if (newSettings.notifications !== undefined) {
      await dbService.saveSetting("notifications", newSettings.notifications);
    }
    if (newSettings.darkMode !== undefined) {
      await dbService.saveSetting("darkMode", newSettings.darkMode);
    }
    if (newSettings.language !== undefined) {
      await dbService.saveSetting("language", newSettings.language);
    }
    if (newSettings.showTimelineImages !== undefined) {
      await dbService.saveSetting("showTimelineImages", newSettings.showTimelineImages);
    }
  },

  addPlant: async (plantData) => {
    const newPlant: Plant = {
      ...plantData,
      id: Math.random().toString(36).substring(7),
      entries: 1,
      healthTrend: [plantData.health],
      status: normalizeHealthStatus(plantData.status, plantData.health),
    };

    await dbService.savePlant(newPlant);
    set((state) => ({ plants: [newPlant, ...state.plants] }));
  },

  updatePlant: async (id, updates) => {
    const state = get();
    const plant = state.plants.find((p) => p.id === id);
    if (!plant) return;

    const updatedPlant = { ...plant, ...updates };

    if (updates.health !== undefined || updates.status !== undefined) {
      updatedPlant.status = normalizeHealthStatus(updates.status ?? updatedPlant.status, updates.health ?? updatedPlant.health);
    }

    await dbService.savePlant(updatedPlant);

    set((state) => ({
      plants: state.plants.map((p) => (p.id === id ? updatedPlant : p)),
    }));
  },

  deletePlant: async (id) => {
    await dbService.deletePlant(id);
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
      scans: state.scans.filter((s) => s.plantId !== id),
      plantEntries: state.plantEntries.filter((e) => e.plantId !== id),
    }));
  },

  addScan: async (scan) => {
    await dbService.saveScan(scan);

    set((state) => {
      const updatedScans = [scan, ...state.scans];

      if (scan.plantId) {
        const updatedPlants = state.plants.map((p) => {
          if (p.id === scan.plantId) {
            const newTrend = [...p.healthTrend, scan.healthScore].slice(-10);
            const avgHealth = Math.round(newTrend.reduce((a, b) => a + b, 0) / newTrend.length);
            const updatedPlant = {
              ...p,
              health: avgHealth,
              lastChecked: scan.date,
              entries: p.entries + 1,
              healthTrend: newTrend,
              status: normalizeHealthStatus(scan.status, avgHealth),
            };
            dbService.savePlant(updatedPlant);
            return updatedPlant;
          }
          return p;
        });
        return { scans: updatedScans, plants: updatedPlants };
      }

      return { scans: updatedScans };
    });
  },

  addPlantEntry: async (entryData) => {
    const newEntry: PlantJournalEntry = {
      id: Math.random().toString(36).substring(7),
      plantId: entryData.plantId,
      note: entryData.note,
      date: new Date().toISOString(),
      imageUri: entryData.imageUri,
    };

    await dbService.savePlantEntry(newEntry);

    set((state) => ({
      plantEntries: [newEntry, ...state.plantEntries],
    }));
  },

  getPlantScans: (plantId) => {
    return get().scans.filter((s) => s.plantId === plantId);
  },

  getPlantEntries: (plantId) => {
    return get().plantEntries.filter((entry) => entry.plantId === plantId);
  },
}));
