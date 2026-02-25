import * as SQLite from 'expo-sqlite';
import { Plant, ScanResult } from '../components/leafrx/types';

const DB_NAME = 'leafrx.db';

// Single shared promise — resolves once, reused everywhere
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
    `);
    
    dbInstance = db;
    return db;
};

// Keep this for your app entry point — it just warms up the singleton
export const initDatabase = () => getDb();

export const dbService = {
    savePlant: async (plant: Plant) => {
        const db = await getDb();
        await db.runAsync(
            'INSERT OR REPLACE INTO plants (id, name, type, health, lastChecked, status, entries, healthTrend) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [plant.id, plant.name, plant.type, plant.health ?? 0, plant.lastChecked, plant.status, plant.entries ?? 0, JSON.stringify(plant.healthTrend || [])]
        );
    },

    getAllPlants: async (): Promise<Plant[]> => {
        const db = await getDb();
        const rows = await db.getAllAsync('SELECT * FROM plants ORDER BY lastChecked DESC');
        return rows.map((row: any) => ({ ...row, healthTrend: JSON.parse(row.healthTrend || '[]') }));
    },

    deletePlant: async (id: string) => {
        const db = await getDb();
        await db.runAsync('DELETE FROM plants WHERE id = ?', [id]);
        await db.runAsync('DELETE FROM scans WHERE plantId = ?', [id]);
    },

    saveScan: async (scan: ScanResult) => {
        const db = await getDb();
        await db.runAsync(
            'INSERT INTO scans (id, plantId, plantName, disease, severity, date, healthScore, predictions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [scan.id, scan.plantId || null, scan.plantName, scan.disease, scan.severity, scan.date, scan.healthScore ?? 0, JSON.stringify(scan.predictions || [])]
        );
    },

    getAllScans: async (): Promise<ScanResult[]> => {
        const db = await getDb();
        const rows = await db.getAllAsync('SELECT * FROM scans ORDER BY date DESC');
        return rows.map((row: any) => ({ ...row, predictions: JSON.parse(row.predictions || '[]') }));
    },
};
