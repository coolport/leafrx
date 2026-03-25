# LeafRx Technical Developer Guide

**Target Audience:** Large Language Models (LLMs) and Senior Developers
**Version:** 1.1.0 (Post-Migration to Zustand & SQLite)

## 1. System Architecture Overview

LeafRx is a high-performance plant health monitoring application built with **React Native (Expo)**. It utilizes a hybrid state management approach combining in-memory reactivity with local persistent storage and a remote machine learning backend.

### 1.1 Core Tech Stack
- **Framework:** Expo 54 (SDK 54)
- **Navigation:** Expo Router (File-system based)
- **State Management:** Zustand (Store-based)
- **Persistence:** `expo-sqlite` (Relational Local DB)
- **Networking:** Axios + TanStack Query (React Query)
- **Styling:** React Native `StyleSheet` (Standard) + Global Theme Constants
- **Backend:** Railway-hosted Python API (YOLOv8/MobileNetV2 analysis)

---

## 2. Directory Structure & Symbol Mapping

| Path | Purpose | Key Symbols |
| :--- | :--- | :--- |
| `app/` | Routing & Screens | `_layout.tsx`, `(tabs)/`, `plant/[id].tsx` |
| `components/leafrx/` | UI Components | `PlantCard`, `HealthOverview`, `Timeline` |
| `services/` | Side Effects & I/O | `api.ts`, `database.ts` |
| `store/` | Global State | `usePlantStore.ts` |
| `constants/` | Static Config | `theme.ts`, `styles.ts`, `mockData.ts` |
| `hooks/` | Custom Logic | `use-theme-color.ts`, `use-color-scheme.ts` |
| `misc/` | Documentation | `api_guide.md`, `dev_guide.md` |

---

## 3. Data Flow & State Management

### 3.1 Global Store (Zustand)
The `usePlantStore` (`store/usePlantStore.ts`) is the single source of truth for UI state. It manages:
- `plants`: Array of tracked plant objects.
- `scans`: History of all diagnostic scans.
- `isHydrated`: Flag indicating if SQLite data has been loaded.

**Hydration Logic:**
The store implements an `initialize()` action that performs a cold-start read from SQLite using `dbService.getAllPlants()` and `dbService.getAllScans()`. This is typically called in the root `_layout.tsx`.

### 3.2 Persistence Layer (SQLite)
`services/database.ts` handles the mapping between TypeScript objects and the SQLite relational schema.
- **Database Name:** `leafrx.db`
- **Tables:**
    - `plants`: Stores plant metadata and health history (JSON-stringified `healthTrend`).
    - `scans`: Stores individual scan results (JSON-stringified `predictions`).
- **Pattern:** The `dbService` provides atomic operations (save, delete, fetch) that are called by the Zustand store actions.

### 3.3 Remote Analysis Pipeline
1. **Trigger:** `app/(tabs)/scan.tsx` captures an image via `expo-image-picker`.
2. **Execution:** `apiService.analyzeImage(uri, plantType)` in `services/api.ts` sends a `multipart/form-data` POST request to the Railway API.
3. **Response:** Returns an `AnalysisResponse` containing detection boxes, disease diagnosis, and health scores.
4. **Integration:** Upon successful scan, the app calls `store.addScan()`, which updates the local `scans` list and triggers an update to the specific plant's health metrics in the `plants` table.

---

## 4. Navigation & Routing

LeafRx uses Expo Router's file-based system.

### 4.1 Layouts
- **Root Layout (`app/_layout.tsx`):** Wraps the app in `QueryClientProvider` (TanStack) and `ThemeProvider`. It handles store initialization.
- **Tab Layout (`app/(tabs)/_layout.tsx`):** Configures the bottom navigation bar (Home, Tracking, Scan, Library, Settings).

### 4.2 Dynamic Routes
- **Plant Details:** `app/plant/[id].tsx` - Accesses plant-specific history and charts.
- **Disease Details:** `app/disease/[name].tsx` - Knowledge base entries for specific diseases.

---

## 5. UI & Design System

### 5.1 Theming
- **`constants/theme.ts`:** Defines the color palette (Primary: `#059669`, Success: `#10b981`, Warning: `#f59e0b`, Diseased: `#ef4444`).
- **`constants/styles.ts`:** Contains common shared styles (containers, headers, buttons).

### 5.2 Component Guidelines
- **Stateless vs Stateful:** Prefer stateless components in `components/leafrx/`. Pass data via props.
- **Charts:** Use the `Chart` component for health trends, which renders simple `View`-based bars for performance.

---

## 6. LLM Operational Context (Internal Reference)

When modifying this codebase, adhere to the following technical constraints:

1.  **Strict Typing:** Always update `components/leafrx/types.ts` when changing data structures.
2.  **Store Consistency:** Never modify the SQLite database directly from a component. Always use a Zustand action from `usePlantStore`.
3.  **API Resilience:** The backend has a slow cold start (up to 60s). Always implement loading states with "First scan may take longer" messaging when calling `/api/analyze`.
4.  **Serialization:** SQLite does not support arrays or nested objects. Ensure `healthTrend` and `predictions` are `JSON.stringify()`'d before insertion and `JSON.parse()`'d on retrieval in `database.ts`.
5.  **Hooks Usage:** Use `useQuery` for read-only remote data (like API health or disease lists) and Zustand for local application state.

---

## 7. Development Workflows

### 7.1 Adding a New Plant Attribute
1. Update `Plant` type in `types.ts`.
2. Update `CREATE TABLE` statement in `database.ts` (Note: Handle migrations or reset DB).
3. Update `savePlant` and `getAllPlants` in `database.ts`.
4. Update `addPlant` action in `usePlantStore.ts`.
5. Update UI components (`PlantCard`, etc.).

### 7.2 Testing API Connectivity
The home screen (`app/(tabs)/index.tsx`) performs a background health check every 60 seconds. Check the green/red indicator in the header to verify if the model server is reachable.
