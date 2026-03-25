import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { usePlantStore } from "../../store/usePlantStore";
import { useTranslations } from "../../hooks/use-translations";
import { getHealthColor, getHealthStatus } from "../../constants/health";

export function HealthOverview() {
  const plants = usePlantStore((state) => state.plants);
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();

  const totalPlants = plants.length;
  const healthyCount = plants.filter((p) => p.status === "healthy").length;
  const warningCount = plants.filter((p) => p.status === "warning").length;
  const criticalCount = plants.filter((p) => p.status === "diseased").length;

  const averageHealth = totalPlants > 0 ? Math.round(plants.reduce((acc, p) => acc + p.health, 0) / totalPlants) : 100;
  const healthStatus = getHealthStatus(averageHealth);
  const healthColor = getHealthColor(healthStatus, colors);

  return (
    <View style={styles.healthOverview}>
      <View style={styles.healthOverviewTop}>
        <View>
          <Text style={styles.healthLabel}>{t.home.farmOverview}</Text>
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
              {t.home.keepItUp}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              backgroundColor: `${healthColor}22`,
              borderColor: `${healthColor}30`,
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={[styles.healthScore, { fontSize: 16, color: "#fff" }]}>
              {totalPlants > 0 ? t.home[healthStatus].toUpperCase() : "--"}
            </Text>
          </View>
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
          <Text style={styles.badgeText}>{healthyCount} {t.home.healthy}</Text>
        </View>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <Text style={styles.badgeText}>{warningCount} {t.home.warning}</Text>
        </View>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.badgeText}>{criticalCount} {t.home.diseased}</Text>
        </View>
      </View>
    </View>
  );
}
