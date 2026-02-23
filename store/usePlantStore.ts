import { create } from 'zustand';
import { Plant, ScanResult } from '../components/leafrx/types';
import { dbService } from '../services/database';

interface PlantState {
  plants: Plant[];
  scans: ScanResult[];
  isHydrated: boolean;
  
  // Lifecycle
  initialize: () => Promise<void>;
  
  // Plant Actions
  addPlant: (plant: Omit<Plant, 'id' | 'entries' | 'healthTrend'>) => Promise<void>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  
  // Scan Actions
  addScan: (scan: ScanResult) => Promise<void>;
  getPlantScans: (plantId: string) => ScanResult[];
}

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: [],
  scans: [],
  isHydrated: false,

  initialize: async () => {
    try {
      const [dbPlants, dbScans] = await Promise.all([
        dbService.getAllPlants(),
        dbService.getAllScans()
      ]);
      set({ plants: dbPlants, scans: dbScans, isHydrated: true });
    } catch (error) {
      console.error("Failed to hydrate store from SQLite:", error);
      set({ isHydrated: true });
    }
  },

  addPlant: async (plantData) => {
    const newPlant: Plant = {
      ...plantData,
      id: Math.random().toString(36).substring(7),
      entries: 0,
      healthTrend: [plantData.health],
    };
    
    await dbService.savePlant(newPlant);
    set((state) => ({ plants: [newPlant, ...state.plants] }));
  },

  updatePlant: async (id, updates) => {
    const state = get();
    const plant = state.plants.find(p => p.id === id);
    if (!plant) return;

    const updatedPlant = { ...plant, ...updates };
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
            const updatedPlant = {
              ...p,
              health: scan.healthScore,
              lastChecked: scan.date,
              entries: p.entries + 1,
              healthTrend: newTrend,
              status: scan.healthScore >= 80 ? 'healthy' : scan.healthScore >= 60 ? 'warning' : 'critical' as any,
            };
            // Side effect: Async save updated plant stats to DB
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

  getPlantScans: (plantId) => {
    return get().scans.filter((s) => s.plantId === plantId);
  },
}));
