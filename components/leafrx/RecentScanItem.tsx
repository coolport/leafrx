import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "../../hooks/use-colors";
import { ScanResult } from "./types";
import { useRouter } from "expo-router";
import { getHealthColor, normalizeHealthStatus, HealthStatus } from "../../constants/health";

type RecentScanItemProps = {
  scan: ScanResult;
};

const STATUS_LABEL: Record<HealthStatus, string> = {
  healthy:  "Healthy",
  warning:  "Warning",
  diseased: "Diseased",
};

const STATUS_ICON: Record<HealthStatus, React.ComponentProps<typeof Feather>["name"]> = {
  healthy:  "check-circle",
  warning:  "alert-circle",
  diseased: "x-circle",
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
  const router = useRouter();
  const colors = useColors();
  const healthStatus = normalizeHealthStatus(scan.status, scan.healthScore);
  const healthColor = getHealthColor(healthStatus, colors);

  const handlePress = () => {
    if (scan.plantId) router.push(`/plant/${scan.plantId}`);
  };

  const formattedDate = new Date(scan.date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const displayDisease =
    scan.disease.charAt(0).toUpperCase() + scan.disease.slice(1).toLowerCase();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!scan.plantId}
      activeOpacity={0.75}
      style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 11 }}>
        {/* Status icon circle — slightly smaller */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${healthColor}18`,
            borderWidth: 2,
            borderColor: `${healthColor}50`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
            flexShrink: 0,
          }}
        >
          <Feather name={STATUS_ICON[healthStatus]} size={18} color={healthColor} />
        </View>

        {/* Main info — two rows only */}
        <View style={{ flex: 1 }}>
          {/* Row 1: plant name + date */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{ color: colors.text, fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 }}
              numberOfLines={1}
            >
              {scan.plantName || "Unassigned"}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "500" }}>
              {formattedDate}
            </Text>
          </View>

          {/* Row 2: disease name + status badge inline */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3, gap: 6 }}>
            <Text
              style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "500", flexShrink: 1 }}
              numberOfLines={1}
            >
              {displayDisease}
            </Text>
            <View
              style={{
                backgroundColor: `${healthColor}18`,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: healthColor, fontSize: 10, fontWeight: "700" }}>
                {STATUS_LABEL[healthStatus]}
              </Text>
            </View>
          </View>
        </View>

        {scan.plantId && (
          <Feather name="chevron-right" size={16} color={colors.textMuted} style={{ marginLeft: 6 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}
