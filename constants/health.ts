export type HealthStatus = "healthy" | "warning" | "diseased";

const LEGACY_TO_STATUS: Record<string, HealthStatus> = {
  optimal: "healthy",
  good: "healthy",
  fair: "warning",
  poor: "warning",
  healthy: "healthy",
  warning: "warning",
  critical: "diseased",
};

export const getHealthStatus = (score: number): HealthStatus => {
  if (score >= 80) return "healthy";
  if (score >= 60) return "warning";
  return "diseased";
};

export const normalizeHealthStatus = (status?: string | null, score?: number): HealthStatus => {
  if (status) {
    const normalized = LEGACY_TO_STATUS[status.toLowerCase()];
    if (normalized) return normalized;
  }

  return getHealthStatus(score ?? 0);
};

export const getHealthColor = (status: HealthStatus, colors: any) => {
  switch (status) {
    case "healthy":
      return colors.success;
    case "warning":
      return colors.warning;
    case "diseased":
      return colors.danger;
    default:
      return colors.textMuted;
  }
};
