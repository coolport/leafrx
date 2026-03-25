import * as SQLite from "expo-sqlite";
import { Plant, ScanResult } from "../components/leafrx/types";
import { normalizeHealthStatus } from "../constants/health";

const DB_NAME = "leafrx.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS plants (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            health REAL NOT NULL,
            lastChecked TEXT NOT NULL,
            status TEXT NOT NULL,
            entries INTEGER DEFAULT 0,
            healthTrend TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY NOT NULL,
            plantId TEXT,
            plantName TEXT NOT NULL,
            disease TEXT NOT NULL,
            severity TEXT NOT NULL,
            date TEXT NOT NULL,
            healthScore REAL NOT NULL,
            predictions TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        );
    `);

  try {
    await db.execAsync("ALTER TABLE scans ADD COLUMN status TEXT");
  } catch {
    // Column already exists.
  }

  dbInstance = db;
  return db;
};

export const initDatabase = () => getDb();

export const dbService = {
  saveSetting: async (key: string, value: any) => {
    const db = await getDb();
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, JSON.stringify(value)]);
  },

  getSetting: async (key: string, defaultValue: any): Promise<any> => {
    const db = await getDb();
    const row: any = await db.getFirstAsync("SELECT value FROM settings WHERE key = ?", [key]);
    return row ? JSON.parse(row.value) : defaultValue;
  },

  savePlant: async (plant: Plant) => {
    const db = await getDb();
    await db.runAsync(
      "INSERT OR REPLACE INTO plants (id, name, type, health, lastChecked, status, entries, healthTrend) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        plant.id,
        plant.name,
        plant.type,
        plant.health ?? 0,
        plant.lastChecked,
        normalizeHealthStatus(plant.status, plant.health),
        plant.entries ?? 0,
        JSON.stringify(plant.healthTrend || []),
      ]
    );
  },

  getAllPlants: async (): Promise<Plant[]> => {
    const db = await getDb();
    const rows = await db.getAllAsync("SELECT * FROM plants ORDER BY lastChecked DESC");
    return rows.map((row: any) => ({
      ...row,
      status: normalizeHealthStatus(row.status, row.health),
      healthTrend: JSON.parse(row.healthTrend || "[]"),
    }));
  },

  deletePlant: async (id: string) => {
    const db = await getDb();
    await db.runAsync("DELETE FROM plants WHERE id = ?", [id]);
    await db.runAsync("DELETE FROM scans WHERE plantId = ?", [id]);
  },

  saveScan: async (scan: ScanResult) => {
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO scans (id, plantId, plantName, disease, severity, date, healthScore, status, predictions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        scan.id,
        scan.plantId || null,
        scan.plantName,
        scan.disease,
        scan.severity,
        scan.date,
        scan.healthScore ?? 0,
        normalizeHealthStatus(scan.status, scan.healthScore),
        JSON.stringify(scan.predictions || []),
      ]
    );
  },

  getAllScans: async (): Promise<ScanResult[]> => {
    const db = await getDb();
    const rows = await db.getAllAsync("SELECT * FROM scans ORDER BY date DESC");
    return rows.map((row: any) => ({
      ...row,
      status: normalizeHealthStatus(row.status, row.healthScore),
      predictions: JSON.parse(row.predictions || "[]"),
    }));
  },
};
