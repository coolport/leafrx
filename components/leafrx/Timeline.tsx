import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { ScanResult } from "./types";
import { getHealthColor, normalizeHealthStatus, HealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";

interface TimelineProps {
  scans?: ScanResult[];
}

export function Timeline({ scans = [] }: TimelineProps) {
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedScan(scan)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.01,
                  shadowRadius: 10,
                  elevation: 0,
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
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Scan Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedScan}
        onRequestClose={() => setSelectedScan(null)}
      >
        <BlurView intensity={30} tint={colors.card === "#ffffff" ? "light" : "dark"} style={styles.modalContainer}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingVertical: 16,
              }}
            >
              <Text style={[styles.modalTitle, { textAlign: "left", marginBottom: 0 }]}>Scan Details</Text>
              <TouchableOpacity onPress={() => setSelectedScan(null)}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 8,
                    borderRadius: 20,
                  }}
                >
                  <Feather name="x" size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 20,
              }}
            >
              {selectedScan?.imageUri && (
                <Image
                  source={{ uri: selectedScan.imageUri }}
                  style={{
                    width: "100%",
                    height: 240,
                    borderRadius: 24,
                    marginBottom: 20,
                  }}
                  resizeMode="cover"
                />
              )}

              <View
                style={{
                  backgroundColor: getHealthColor(normalizeHealthStatus(selectedScan?.status || "warning", selectedScan?.healthScore), colors) + "15",
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 20,
                  borderLeftWidth: 6,
                  borderLeftColor: getHealthColor(normalizeHealthStatus(selectedScan?.status || "warning", selectedScan?.healthScore), colors),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}
                    >
                      Detection
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "800",
                        color: colors.text,
                      }}
                    >
                      {(selectedScan?.disease || "Healthy").toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textMuted,
                        marginTop: 4,
                        fontWeight: "600"
                      }}
                    >
                      {selectedScan ? new Date(selectedScan.date).toLocaleString() : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 100,
                      height: 80,
                      borderRadius: 20,
                      backgroundColor: colors.card,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: colors.cardShadow,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      elevation: 5,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "900",
                        color: getHealthColor(normalizeHealthStatus(selectedScan?.status || "warning", selectedScan?.healthScore), colors),
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {selectedScan ? t.home[normalizeHealthStatus(selectedScan.status, selectedScan.healthScore)] : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: colors.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {t.healthLevels.label.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {selectedScan?.predictions?.[0]?.recommendations && selectedScan.predictions[0].recommendations.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>Recommendations</Text>
                  {selectedScan.predictions[0].recommendations.map((rec, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        marginBottom: 6,
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: `${colors.success}1A`,
                          padding: 6,
                          borderRadius: 10,
                        }}
                      >
                        <Feather name="check" size={14} color={colors.success} />
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: colors.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        {rec || ""}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 40,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ width: "100%" }}
                onPress={() => setSelectedScan(null)}
              >
                <LinearGradient
                  colors={[colors.primaryDark, colors.primary] as any}
                  style={[styles.modalButton, { marginHorizontal: 0 }]}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
