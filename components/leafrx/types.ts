export type Plant = {
  id: string; // Changed to string to support UUIDs or API IDs
  name: string;
  type: string;
  health: number;
  lastChecked: string;
  status: "healthy" | "warning" | "critical";
  entries: number;
  healthTrend: number[];
};

export type Prediction = {
  leaf_id: number;
  bbox: [number, number, number, number];
  detection_confidence: number;
  plant_type: string;
  disease: string;
  disease_confidence: number;
  severity: "none" | "early" | "moderate" | "severe";
  health_score: number;
  recommendations: string[];
  verification_warning: string | null;
};

export type AnalysisResponse = {
  success: boolean;
  image_id?: string;
  timestamp?: string;
  processing_time_seconds?: number;
  overall_health_score?: number;
  status?: "healthy" | "warning" | "critical";
  leaves_detected?: number;
  leaves_analyzed?: number;
  healthy_leaves?: number;
  diseased_leaves?: number;
  primary_disease?: string;
  disease_distribution?: Record<string, number>;
  predictions?: Prediction[];
  error?: string;
  suggestion?: string;
};

export type ScanResult = {
  id: string;
  plantId?: string;
  plantName: string;
  disease: string;
  severity: string;
  date: string;
  healthScore: number;
  predictions: Prediction[];
};

export type TimelineEntry = {
  date: string;
  time: string;
  health: number;
  status: "healthy" | "warning" | "critical";
  note: string;
};

export type Disease = {
  id: string;
  plant: string;
  disease: string;
  display_name: string;
  description?: string;
  recommendations?: string[];
};

export type DiseaseSummary = {
  count: number;
  diseases: Disease[];
};
