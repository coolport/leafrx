import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { useColors } from "../../hooks/use-colors";
import { useTranslations } from "../../hooks/use-translations";
import { getHealthColor, HealthStatus, normalizeHealthStatus } from "../../constants/health";

type ChartProps = {
  statuses: HealthStatus[];
  labels: string[];
};

const LEVEL_ORDER: HealthStatus[] = ["healthy", "warning", "diseased"];
const CHART_HEIGHT = 150;
const CARD_PADDING = 20;
const Y_LABEL_WIDTH = 68;

export function Chart({ statuses, labels }: ChartProps) {
  const colors = useColors();
  const { t } = useTranslations();
  const { width } = useWindowDimensions();

  if (statuses.length === 0) return null;

  const normalizedStatuses = statuses.map((status) => normalizeHealthStatus(status));
  const latestStatus = normalizedStatuses[normalizedStatuses.length - 1];
  const latestColor = getHealthColor(latestStatus, colors);
  const chartWidth = Math.max(width - 48 - CARD_PADDING * 2 - Y_LABEL_WIDTH, 180);
  const counts = normalizedStatuses.reduce(
    (acc, status) => {
      acc[status] += 1;
      return acc;
    },
    { healthy: 0, warning: 0, diseased: 0 } as Record<HealthStatus, number>
  );

  const yPositions = {
    healthy: 18,
    warning: CHART_HEIGHT / 2,
    diseased: CHART_HEIGHT - 18,
  } satisfies Record<HealthStatus, number>;

  const points = normalizedStatuses.map((status, index) => {
    const x =
      normalizedStatuses.length === 1
        ? chartWidth / 2
        : (index / (normalizedStatuses.length - 1)) * chartWidth;

    return {
      x,
      y: yPositions[status],
      status,
    };
  });

  const polylinePoints = points.map((point) => point.x + "," + point.y).join(" ");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: CARD_PADDING,
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
            backgroundColor: latestColor + "18",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: latestColor + "30",
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

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: Y_LABEL_WIDTH, height: CHART_HEIGHT, justifyContent: "space-between", paddingRight: 8 }}>
          {LEVEL_ORDER.map((status) => (
            <Text
              key={status}
              style={{
                fontSize: 10,
                fontWeight: "800",
                color: getHealthColor(status, colors),
                textTransform: "uppercase",
              }}
            >
              {t.home[status]}
            </Text>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            {LEVEL_ORDER.map((status) => (
              <Line
                key={status}
                x1={0}
                y1={yPositions[status]}
                x2={chartWidth}
                y2={yPositions[status]}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            ))}

            {points.length > 1 && (
              <Polyline
                points={polylinePoints}
                fill="none"
                stroke={latestColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((point, index) => {
              const pointColor = getHealthColor(point.status, colors);

              return (
                <React.Fragment key={String(index) + point.status}>
                  <Circle cx={point.x} cy={point.y} r={5} fill={colors.card} stroke={pointColor} strokeWidth={3} />
                  {index === points.length - 1 && <Circle cx={point.x} cy={point.y} r={9} fill={pointColor} opacity={0.18} />}
                </React.Fragment>
              );
            })}
          </Svg>

          <View
            style={{
              flexDirection: "row",
              justifyContent: normalizedStatuses.length === 1 ? "center" : "space-between",
              marginTop: 12,
            }}
          >
            {labels.map((label, index) => (
              <Text
                key={String(index) + label}
                style={{
                  fontSize: 9,
                  fontWeight: "700",
                  color: index === labels.length - 1 ? latestColor : colors.textMuted,
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>
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
        {LEVEL_ORDER.map((status) => {
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
