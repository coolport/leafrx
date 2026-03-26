import React from "react";
import { View, Text } from "react-native";
import { useTranslations } from "../../hooks/use-translations";
import { usePlantStore } from "../../store/usePlantStore";

export function HealthOverview() {
  const plants = usePlantStore((state) => state.plants);
  const { t } = useTranslations();

  const totalPlants = plants.length;
  const healthyCount = plants.filter((p) => p.status === "healthy").length;
  const warningCount = plants.filter((p) => p.status === "warning").length;

  const stats = [
    { value: totalPlants, label: "Total" },
    { value: healthyCount, label: t.home.healthy },
    { value: warningCount, label: t.home.warning },
  ];

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        padding: 20,
        borderRadius: 24,
        marginHorizontal: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, gap: 12 }}>
        {stats.map(({ value, label }) => (
          <View
            key={label}
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.22)",
              borderRadius: 16,
              padding: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.45)",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800" }}>{value}</Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 11,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
