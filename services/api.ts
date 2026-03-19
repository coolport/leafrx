import axios from "axios";
import { AnalysisResponse, Disease, DiseaseSummary } from "../components/leafrx/types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds as per guide note about slow cold start
});

export const apiService = {
  /**
   * Check if the API is online
   */
  getHealth: async () => {
    const response = await api.get("/api/health");
    return response.data;
  },

  /**
   * Get list of supported plant types
   */
  getPlantTypes: async (): Promise<string[]> => {
    const response = await api.get("/api/plant-types");
    return response.data.plant_types;
  },

  /**
   * Get all diseases or filter by plant
   */
  getDiseases: async (): Promise<DiseaseSummary> => {
    const response = await api.get("/api/diseases");
    return response.data;
  },

  /**
   * Get specific disease details
   */
  getDiseaseDetails: async (id: string): Promise<Disease> => {
    const response = await api.get(`/api/disease/${id}`);
    return response.data;
  },

  /**
   * Analyze leaf image
   */
  analyzeImage: async (imageUri: string, plantType?: string): Promise<AnalysisResponse> => {
    const formData = new FormData();

    // In React Native, we need to handle the image file differently for FormData
    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    // @ts-ignore - React Native FormData requires this structure
    formData.append("image", {
      uri: imageUri,
      name: `photo.${fileType}`,
      type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
    });

    if (plantType) {
      formData.append("plant_type", plantType);
    }

    try {
      const response = await api.post<AnalysisResponse>("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data as AnalysisResponse;
      }
      return {
        success: false,
        error: "Network error or server timeout",
        suggestion: "Please check your connection and try again.",
      };
    }
  },
};

export default api;
