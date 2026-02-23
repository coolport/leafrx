# LeafRx


LeafRx is a mobile app that helps users monitor plant health using AI-powered leaf analysis. Users can scan leaves to detect diseases, track plant health over time, and access a built-in library of plant diseases and treatments.

- **AI Leaf Scanning** – Disease detection and health scoring from leaf photos  
- **Plant Tracking** – Monitor individual plants with health history and scan records  
- **Disease Library** – Browse symptoms, descriptions, and treatment recommendations  
- **Clean UI** – Simple, intuitive plant management experience  
- **Local Storage** – Secure SQLite-based data persistence  

## Technical Stack

React Native (Expo SDK 54+) w/ TypeScript, Expo Router, Zustand, TanStack Query (React Query), Axios, Expo SQLite, Expo ImagePicker, Flask-based RiceRx AI backend API.

## Project Structure

```
.
├── app/                  # Application screens and routing (Expo Router)
│   ├── (tabs)/           # Main tab-based navigation
│   ├── disease/          # Dynamic route for disease details
│   └── plant/            # Dynamic route for individual plant details
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components (PlantCard, Chart, Modals, etc.)
├── constants/            # Application-wide constants (styles, theme)
├── hooks/                # Custom React hooks
├── services/             # API integration (api.ts) and local database operations (database.ts)
└── store/                # Zustand stores for client-side state management (usePlantStore.ts)
└── ... (other configuration files like package.json, tsconfig.json, eas.json)
```

## Development

```bash
npm install -g expo-cli 
npm install
npx expo start
