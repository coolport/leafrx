import { HealthStatus } from "../../constants/health";

export type Plant = {
  id: string;
  name: string;
  type: string;
  health: number;
  lastChecked: string;
  status: HealthStatus;
  entries: number;
  healthTrend: number[];
  imageUri?: string;
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
  status?: HealthStatus;
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
  status: HealthStatus;
  predictions: Prediction[];
};

export type TimelineEntry = {
  date: string;
  time: string;
  health: number;
  status: HealthStatus;
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
