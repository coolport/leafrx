import React from "react";
import { View, Text } from "react-native";
import { useColors } from "../../hooks/use-colors";
import { useTranslations } from "../../hooks/use-translations";
import { getHealthColor, HealthStatus, normalizeHealthStatus } from "../../constants/health";

type ChartProps = {
  statuses: HealthStatus[];
  labels: string[];
};

export function Chart({ statuses, labels }: ChartProps) {
  const colors = useColors();
  const { t } = useTranslations();

  if (statuses.length === 0) return null;

  const normalizedStatuses = statuses.map((status) => normalizeHealthStatus(status));
  const latestStatus = normalizedStatuses[normalizedStatuses.length - 1];
  const latestColor = getHealthColor(latestStatus, colors);
  const counts = normalizedStatuses.reduce(
    (acc, status) => {
      acc[status] += 1;
      return acc;
    },
    { healthy: 0, warning: 0, critical: 0 } as Record<HealthStatus, number>
  );

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: colors.textMuted,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Health History
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: colors.text,
              textTransform: "uppercase",
            }}
          >
            {t.home[latestStatus]}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: `${latestColor}18`,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: `${latestColor}30`,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "800",
              color: latestColor,
              textTransform: "uppercase",
            }}
          >
            {t.healthLevels.label}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {normalizedStatuses.map((status, index) => {
          const statusColor = getHealthColor(status, colors);

          return (
            <View
              key={`${labels[index] ?? index}-${status}`}
              style={{
                flex: 1,
                backgroundColor: colors.background,
                borderRadius: 16,
                padding: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: statusColor,
                  marginBottom: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: statusColor,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
                numberOfLines={1}
              >
                {t.home[status]}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: colors.textMuted,
                }}
                numberOfLines={1}
              >
                {labels[index]}
              </Text>
            </View>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 18,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        {(["healthy", "warning", "critical"] as HealthStatus[]).map((status) => {
          const statusColor = getHealthColor(status, colors);

          return (
            <View key={status} style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: statusColor,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {t.home[status]}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "800", color: colors.text }}>{counts[status]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
