import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { usePlantStore } from "../../store/usePlantStore";

export function HealthOverview() {
  const { plants } = usePlantStore();
  const colors = useColors();
  const styles = createStyles(colors);

  const totalPlants = plants.length;
  const healthyCount = plants.filter((p) => p.status === "healthy").length;
  const warningCount = plants.filter((p) => p.status === "warning").length;
  const criticalCount = plants.filter((p) => p.status === "critical").length;

  const averageHealth = totalPlants > 0 ? Math.round(plants.reduce((acc, p) => acc + p.health, 0) / totalPlants) : 100;

  return (
    <View style={styles.healthOverview}>
      <View style={styles.healthOverviewTop}>
        <View>
          <Text style={styles.healthLabel}>Farm Health Overview</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Feather name="trending-up" size={14} color="#4ade80" />
            <Text
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                marginLeft: 4,
                fontWeight: "600",
              }}
            >
              Keep it up!
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.healthScore}>{totalPlants > 0 ? averageHealth : "--"}%</Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          marginVertical: 16,
        }}
      />

      <View style={styles.healthBadges}>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.badgeText}>{healthyCount} Healthy</Text>
        </View>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <Text style={styles.badgeText}>{warningCount} Warning</Text>
        </View>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.badgeText}>{criticalCount} Critical</Text>
        </View>
      </View>
    </View>
  );
}
