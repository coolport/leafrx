import React from "react";
import { View, Text } from "react-native";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { ScanResult } from "./types";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";

interface TimelineProps {
  scans?: ScanResult[];
}

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

        return (
          <View key={scan.id} style={styles.timelineItem}>
            <View style={styles.timelineDotContainer}>
              <View style={[styles.timelineDot, { backgroundColor: statusColor }]} />
              {i < scans.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineDate}>{date.toLocaleDateString()}</Text>
                <Text style={styles.timelineTime}>
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View style={styles.timelineCard}>
                <View style={styles.timelineCardHeader}>
                  <Text style={styles.timelineCardLabel}>{scan.disease.toUpperCase()}</Text>
                  <Text style={[styles.timelineCardScore, { color: statusColor }]}>{t.home[status].toUpperCase()}</Text>
                </View>
                <Text style={styles.timelineCardNote}>
                  {scan.severity && scan.severity !== "none" ? `Severity: ${scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}. ` : ""}
                  Detected {scan.predictions.length} leaf areas.
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
