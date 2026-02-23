# Developer Guide: Leafrx Mobile App

Welcome to the developer guide for the Leafrx mobile application. This document provides a comprehensive overview of the project's structure, architecture, and core concepts to help you get started with development.

## 1. Introduction

Leafrx is a mobile application designed for monitoring plant and farm health. It allows users to track individual plants, scan for diseases, and view health trends over time.

The application is built using:
- **React Native**: A framework for building native apps using React.
- **Expo**: A platform and set of tools built around React Native that simplifies development and deployment.
- **Expo Router**: A file-system based router for React Native and web applications, enabling easy navigation.

## 2. Project Structure Overview

The project follows a logical structure, separating concerns into distinct directories. Here's a breakdown of the most important folders:

```
/
├── app/                  # Application screens and routing
│   ├── (tabs)/           # Layout and screens for the main tab bar
│   │   ├── _layout.tsx   # Configures the tab navigator
│   │   ├── index.tsx     # Home screen
│   │   ├── library.tsx   # Knowledge library screen
│   │   ├── scan.tsx      # Leaf scanning screen
│   │   ├── settings.tsx  # Settings screen
│   │   └── tracking.tsx  # Plant tracking screen
│   ├── plant/
│   │   └── [id].tsx      # Dynamic screen for viewing a single plant's details
│   └── _layout.tsx       # Root layout for the entire application
│
├── assets/               # Static assets like images and fonts
│
├── components/           # Reusable UI components
│   └── leafrx/           # Custom components specific to this app
│
├── constants/            # Application-wide constants
│   ├── mockData.ts       # Mock data for plants, scans, etc.
│   └── styles.ts         # Global stylesheet
│
└── ... (other configuration files)
```

- **`app/`**: This is the most critical directory for the application's structure and navigation. Expo Router uses the file and directory names within `app/` to define the navigation routes.
- **`components/leafrx/`**: Contains all the reusable UI components that make up the different screens, such as `PlantCard`, `HealthOverview`, and `Chart`.
- **`constants/`**: Holds static data and configuration. All mock data is in `mockData.ts` and all global styles are in `styles.ts`.
- **`assets/`**: Stores static files like images, icons, and fonts.

## 3. Navigation

Navigation is handled entirely by **Expo Router**. The routes are defined by the file structure within the `app` directory.

### Tab Navigation

- The main tab bar is defined in **`app/(tabs)/_layout.tsx`**. This file uses the `<Tabs>` component from Expo Router to create the bottom navigation bar.
- Each tab corresponds to a file within the `app/(tabs)/` directory. For example, the "Scan" tab links to the `app/(tabs)/scan.tsx` screen.
- The `(tabs)` directory is a "route group" in Expo Router, which allows us to group a set of routes and give them a shared layout.

### Stack Navigation & Dynamic Routes

- The root layout at **`app/_layout.tsx`** sets up a `<Stack>` navigator. This allows us to push new screens on top of the current view, such as opening a detail screen.
- The plant detail screen is a **dynamic route**. The file **`app/plant/[id].tsx`** will match any route like `/plant/1`, `/plant/2`, etc.
- Inside this screen, you can use the `useLocalSearchParams` hook from Expo Router to get the value of the `id` parameter from the URL.

### Navigating Between Screens

To navigate, use the `<Link>` component from `expo-router`.

**Example:** Navigating to a plant's detail page.
```tsx
// From components/leafrx/PlantCard.tsx
import { Link } from 'expo-router';

// ...
<Link href={`/plant/${plant.id}`} asChild>
  <TouchableOpacity>
    {/* ... card content ... */}
  </TouchableOpacity>
</Link>
```
This code wraps a `TouchableOpacity` in a `<Link>`. When the user presses it, they will be navigated to the dynamic route for that specific plant.

## 4. Components

Reusable components are the building blocks of the app. They are all located in `components/leafrx/`.

- `HealthOverview.tsx`: The dashboard header on the home screen.
- `PlantCard.tsx`: A card that displays a summary of a single plant. Used on the Home and Tracking screens.
- `QuickActions.tsx`: The "Scan Leaf" and "Add Plant" buttons on the home screen.
- `RecentScanItem.tsx`: A small item to show a summary of a recent scan.
- `Chart.tsx`: The bar chart component used on the plant detail screen.
- `StatCard.tsx`: A card for displaying a single statistic (e.g., "Days Tracked").
- `Timeline.tsx`: The vertical timeline component on the plant detail screen.
- `types.ts`: Contains TypeScript type definitions for our data models (`Plant`, `Scan`, etc.).

## 5. Data and State

- **Mock Data**: Currently, all data is hardcoded in **`constants/mockData.ts`**. This is where you can find the arrays of plants, scans, and timeline entries. In a real-world application, this would be replaced with API calls to a backend service.
- **Navigation State**: Managed automatically by Expo Router based on the current URL.
- **Local Component State**: Managed within individual components using React's `useState` hook. There is no global state management library (like Redux or Zustand) in place yet.

## 6. Styling

- A global stylesheet is defined in **`constants/styles.ts`** using React Native's `StyleSheet.create` API.
- Components import this `styles` object to style their elements. This helps maintain a consistent look and feel.
- For dynamic styles (e.g., changing a color based on a prop), a combination of the global style and an inline style object is used.

## 7. A Step-by-Step Walkthrough

1.  **App Launch**: The application starts at the root, defined by `app/_layout.tsx`. This file sets up the root `Stack` navigator and renders the `(tabs)` group as the initial screen.
2.  **Tab Layout**: `app/(tabs)/_layout.tsx` takes over. It configures and renders the `Tabs` navigator, setting `index.tsx` as the default home screen.
3.  **Home Screen**: `app/(tabs)/index.tsx` is rendered. It imports and assembles several reusable components (`HealthOverview`, `QuickActions`, `PlantCard`) and populates them with data from `constants/mockData.ts`.
4.  **User Interaction**: The user taps on a `PlantCard`.
5.  **Navigation to Detail**: The `<Link>` component within `PlantCard.tsx` triggers a navigation event to a URL like `/plant/3`.
6.  **Dynamic Route Rendering**: Expo Router matches this URL to the file `app/plant/[id].tsx`. The `DetailScreen` component is rendered.
7.  **Fetching Data**: Inside `DetailScreen`, the `useLocalSearchParams` hook extracts the `id` (`3`) from the URL. It then finds the corresponding plant from the `myPlants` array in `constants/mockData.ts` and displays its details.

This structure provides a solid foundation for building out the rest of the application's features.
