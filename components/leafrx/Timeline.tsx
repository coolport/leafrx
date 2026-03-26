import React from "react";
import { View, Text } from "react-native";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { ScanResult } from "./types";
import { getHealthColor, normalizeHealthStatus, HealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";

interface TimelineProps {
  scans?: ScanResult[];
}

const STATUS_ICON: Record<HealthStatus, string> = {
  healthy:  "●",
  warning:  "●",
  diseased: "●",
};

export function Timeline({ scans = [] }: TimelineProps) {
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();

  if (scans.length === 0) {
    return (
      <View style={styles.timeline}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: colors.textMuted, fontStyle: "italic" }}>No scan history yet.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.timeline}>
      <Text style={styles.sectionTitle}>Timeline</Text>
      {scans.map((scan, i) => {
        const date = new Date(scan.date);
        const status = normalizeHealthStatus(scan.status, scan.healthScore);
        const statusColor = getHealthColor(status, colors);
        const isHealthy = scan.disease.toLowerCase() === "healthy" || !scan.disease;
        const displayDisease =
          scan.disease.charAt(0).toUpperCase() + scan.disease.slice(1).toLowerCase();

        return (
          <View key={scan.id} style={styles.timelineItem}>
            {/* Dot + line */}
            <View style={styles.timelineDotContainer}>
              <View style={[styles.timelineDot, { backgroundColor: statusColor }]} />
              {i < scans.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Content */}
            <View style={[styles.timelineContent, { paddingBottom: i < scans.length - 1 ? 20 : 0 }]}>
              {/* Date + time row */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Text style={styles.timelineDate}>
                  {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>·</Text>
                <Text style={styles.timelineTime}>
                  {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>

              {/* Card */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                {/* Status badge + disease name */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text
                    style={{ color: colors.text, fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 }}
                    numberOfLines={1}
                  >
                    {isHealthy ? "No disease detected" : displayDisease}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${statusColor}18`,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: statusColor, fontSize: 10, fontWeight: "700" }}>
                      {t.home[status].toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
