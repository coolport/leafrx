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
import { useRouter } from "expo-router";
import { resolveDiseaseLibraryId } from "../../constants/diseaseLibrary";

interface TimelineProps {
  scans?: ScanResult[];
}

export function Timeline({ scans = [] }: TimelineProps) {
  const router = useRouter();
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const handleLibraryNav = () => {
    if (!selectedScan) return;

    const firstPred = selectedScan.predictions?.[0];
    const targetId = resolveDiseaseLibraryId({
      explicitId: selectedScan.primary_disease,
      plantType: firstPred?.plant_type,
      diseaseName: firstPred?.disease || selectedScan.disease,
    });

    if (targetId) {
      setSelectedScan(null);
      router.push({
        pathname: "/library",
        params: { selectedId: targetId },
      });
    }
  };

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
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  padding: 18,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.08,
                  shadowRadius: 14,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      color: colors.textMuted,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    Detection
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        getHealthColor(
                          normalizeHealthStatus(selectedScan?.status || "warning", selectedScan?.healthScore),
                          colors
                        ) + "18",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "800",
                        color: getHealthColor(
                          normalizeHealthStatus(selectedScan?.status || "warning", selectedScan?.healthScore),
                          colors
                        ),
                        textTransform: "uppercase",
                      }}
                    >
                      {selectedScan ? t.home[normalizeHealthStatus(selectedScan.status, selectedScan.healthScore)] : ""}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.text,
                    marginBottom: 12,
                    letterSpacing: -0.4,
                  }}
                >
                  {(selectedScan?.disease || "Healthy").toUpperCase()}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  {!!selectedScan?.predictions?.[0]?.plant_type && (
                    <View
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary }}>
                        {selectedScan.predictions[0].plant_type.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 2 }}>
                  <Feather name="clock" size={13} color={colors.textMuted} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      fontWeight: "600",
                    }}
                  >
                    {selectedScan ? new Date(selectedScan.date).toLocaleString() : ""}
                  </Text>
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
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 1 }}
                onPress={handleLibraryNav}
              >
                <View
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: colors.background,
                      marginHorizontal: 0,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flexDirection: "row",
                      gap: 8,
                    },
                  ]}
                >
                  <Feather name="book-open" size={16} color={colors.textSecondary} />
                  <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Guide</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 1 }}
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
