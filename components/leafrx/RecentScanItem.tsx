import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { ScanResult } from "./types";
import { useRouter } from "expo-router";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";

type RecentScanItemProps = {
  scan: ScanResult;
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
  const router = useRouter();
  const colors = useColors();
  const styles = createStyles(colors);
  const healthStatus = normalizeHealthStatus(scan.status, scan.healthScore);
  const healthColor = getHealthColor(healthStatus, colors);

  const handlePress = () => {
    if (scan.plantId) {
      router.push(`/plant/${scan.plantId}`);
    }
  };

  const formattedDate = new Date(scan.date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const displayDisease = scan.disease.charAt(0).toUpperCase() + scan.disease.slice(1).toLowerCase();

  return (
    <TouchableOpacity style={styles.recentScanCard} onPress={handlePress} disabled={!scan.plantId}>
      <View style={[styles.recentScanIconContainer, { backgroundColor: `${healthColor}1A` }]}>
        <Feather name="shield" size={24} color={healthColor} />
      </View>

      <View style={styles.recentScanInfo}>
        <Text style={styles.recentScanPlantName}>{scan.plantName || "Unassigned"}</Text>
        <Text style={styles.recentScanDisease}>{displayDisease}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.recentScanDate}>{formattedDate}</Text>
        {scan.plantId && <Feather name="chevron-right" size={16} color={colors.textMuted} style={{ marginTop: 4 }} />}
      </View>
    </TouchableOpacity>
  );
}
