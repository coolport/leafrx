import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Plant } from "./types";
import { Link } from "expo-router";

type PlantCardProps = {
  plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
  const colors = useColors();
  const styles = createStyles(colors);
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = plant.health / 100;
  const offset = circumference - progress * circumference;

  const getStatusColor = () => {
    if (plant.status === "healthy") return colors.success;
    if (plant.status === "warning") return colors.warning;
    return colors.danger;
  };

  return (
    <Link href={`/plant/${plant.id}`} asChild>
      <TouchableOpacity style={styles.plantCard} activeOpacity={0.7}>
        <View
          style={[
            styles.plantIcon,
            plant.status === "healthy" && {
              backgroundColor: `${colors.success}1A`,
            },
            plant.status === "warning" && {
              backgroundColor: `${colors.warning}1A`,
            },
            plant.status === "critical" && {
              backgroundColor: `${colors.danger}1A`,
            },
          ]}
        >
          <Text style={{ fontSize: 28 }}>{getPlantEmoji(plant.type)}</Text>
        </View>

        <View style={styles.plantInfo}>
          <Text style={styles.plantName} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.plantMeta}>{plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}</Text>
          <View style={styles.lastCheckedContainer}>
            <Text style={styles.lastChecked}>Last checked: {plant.lastChecked}</Text>
          </View>
        </View>

        <View style={styles.plantHealth}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.border}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getStatusColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          </Svg>
          <View style={{ position: "absolute" }}>
            <Text style={[styles.healthScoreText, { color: getStatusColor() }]}>{Math.round(plant.health)}</Text>
          </View>
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
