import { create } from 'zustand';
import { Plant, ScanResult } from '../components/leafrx/types';

interface PlantState {
  plants: Plant[];
  scans: ScanResult[];
  
  // Plant Actions
  addPlant: (plant: Omit<Plant, 'id' | 'entries' | 'healthTrend'>) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  
  // Scan Actions
  addScan: (scan: ScanResult) => void;
  getPlantScans: (plantId: string) => ScanResult[];
}

export const usePlantStore = create<PlantState>((set, get) => ({
  plants: [],
  scans: [],

  addPlant: (plantData) => {
    const newPlant: Plant = {
      ...plantData,
      id: Math.random().toString(36).substring(7),
      entries: 0,
      healthTrend: [plantData.health],
    };
    set((state) => ({ plants: [newPlant, ...state.plants] }));
  },

  updatePlant: (id, updates) => {
    set((state) => ({
      plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deletePlant: (id) => {
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
      scans: state.scans.filter((s) => s.plantId !== id),
    }));
  },

  addScan: (scan) => {
    set((state) => {
      const updatedScans = [scan, ...state.scans];
      
      // If the scan is associated with a plant, update that plant's stats
      if (scan.plantId) {
        const updatedPlants = state.plants.map((p) => {
          if (p.id === scan.plantId) {
            const newTrend = [...p.healthTrend, scan.healthScore].slice(-10);
            return {
              ...p,
              health: scan.healthScore,
              lastChecked: scan.date,
              entries: p.entries + 1,
              healthTrend: newTrend,
              status: scan.healthScore >= 80 ? 'healthy' : scan.healthScore >= 60 ? 'warning' : 'critical' as any,
            };
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
