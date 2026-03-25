import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Plant } from "./types";
import { Link } from "expo-router";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";

type PlantCardProps = {
  plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  const healthStatus = normalizeHealthStatus(plant.status, plant.health);
  const healthColor = getHealthColor(healthStatus, colors);

  return (
    <Link href={`/plant/${plant.id}`} asChild>
      <TouchableOpacity style={styles.plantCard} activeOpacity={0.7}>
        <View style={[styles.plantIcon, { backgroundColor: `${healthColor}1A`, overflow: "hidden" }]}>
          {plant.imageUri ? (
            <Image source={{ uri: plant.imageUri }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <Text style={{ fontSize: 28 }}>{getPlantEmoji(plant.type)}</Text>
          )}
        </View>

        <View style={styles.plantInfo}>
          <Text style={styles.plantName} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.plantMeta}>{plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}</Text>
          <View style={styles.lastCheckedContainer}>
            <Text style={styles.lastChecked}>Last checked: {new Date(plant.lastChecked).toLocaleDateString()}</Text>
          </View>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: `${healthColor}15`,
              borderColor: `${healthColor}30`,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ fontSize: 11, fontWeight: "800", color: healthColor, textTransform: "uppercase" }}>
            {t.home[healthStatus]}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

function getPlantEmoji(type: string) {
  const t = type.toLowerCase();
  if (t.includes("mango")) return "🥭";
  if (t.includes("banana")) return "🍌";
  if (t.includes("guava")) return "🍐";
  if (t.includes("calamansi")) return "🫒";
  return "🌿";
}
