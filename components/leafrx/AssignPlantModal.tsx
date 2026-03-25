import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Feather } from "@expo/vector-icons";
import { Plant } from "./types";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";

type AssignPlantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
};

function getPlantEmoji(type: string) {
  const t = type.toLowerCase();
  if (t.includes("mango")) return "🥭";
  if (t.includes("banana")) return "🍌";
  if (t.includes("guava")) return "🍐";
  if (t.includes("calamansi")) return "🫒";
  return "🌿";
}

export function AssignPlantModal({ isVisible, onClose, plants, onSelectPlant }: AssignPlantModalProps) {
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 6,
            }}
          >
            <View>
              <Text style={styles.modalTitle}>Assign to Plant</Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  fontWeight: "500",
                  marginTop: 3,
                }}
              >
                Select a plant to link this scan
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <Feather name="x" size={18} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: 16,
            }}
          />

          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {plants.length > 0 ? (
              plants.map((plant) => {
                const healthStatus = normalizeHealthStatus(plant.status, plant.health);
                const healthColor = getHealthColor(healthStatus, colors);

                return (
                  <TouchableOpacity
                    key={plant.id}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      backgroundColor: colors.background,
                      borderRadius: 16,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                    onPress={() => onSelectPlant(plant)}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: colors.primary + "1A",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.primary + "33",
                      }}
                    >
                      <Text style={{ fontSize: 22 }}>{getPlantEmoji(plant.type)}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: colors.text,
                          marginBottom: 2,
                        }}
                      >
                        {plant.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textMuted,
                          fontWeight: "500",
                        }}
                      >
                        {plant.type}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <View
                        style={{
                          backgroundColor: healthColor + "15",
                          borderWidth: 1,
                          borderColor: healthColor + "30",
                          borderRadius: 999,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: healthColor,
                            textTransform: "uppercase",
                          }}
                        >
                          {t.home[healthStatus]}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={16} color={colors.textMuted} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 32, gap: 10 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 20,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="inbox" size={24} color={colors.textMuted} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: colors.text,
                  }}
                >
                  No plants yet
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  Add a new plant first to assign this scan.
                </Text>
              </View>
            )}
          </ScrollView>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: 16,
            }}
          />

          <TouchableOpacity activeOpacity={0.7} style={[styles.btnSecondary, { width: "100%" }]} onPress={onClose}>
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
