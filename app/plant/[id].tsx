import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert, Image, ActivityIndicator, Modal, } from "react-native";
import { useSafeAreaInsets, SafeAreaView, } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../../constants/styles";
import { Chart } from "../../components/leafrx/Chart";
import { StatCard } from "../../components/leafrx/StatCard";
import { Timeline } from "../../components/leafrx/Timeline";
import { usePlantStore } from "../../store/usePlantStore";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { AnalysisResponse, ScanResult } from "../../components/leafrx/types";

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const plantId = Array.isArray(id) ? id[0] : id;

  const { plants, getPlantScans, deletePlant, addScan } = usePlantStore();
  const selectedPlant = plants.find((p) => p.id === plantId);
  const plantScans = getPlantScans(plantId);

  const [isResultsModalVisible, setResultsModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: ({ uri, type }: { uri: string; type?: string }) =>
      apiService.analyzeImage(uri, type),
    onSuccess: (data) => {
      if (data.success) {
        setAnalysisResult(data);
        setResultsModalVisible(true);
        saveScanToStore(data);
      } else {
        Alert.alert("Analysis Failed", data.error || "Unknown error occurred");
      }
    },
    onError: () => {
      Alert.alert("Connection Error", "Failed to connect to the server.");
    },
  });

  const processImage = async (uri: string) => {
    setSelectedImageUri(uri);
    mutation.mutate({ uri, type: selectedPlant?.type });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) processImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) processImage(result.assets[0].uri);
  };

  const saveScanToStore = async (result: AnalysisResponse) => {
    if (!selectedPlant) return;
    const [_, disease] = result.primary_disease?.split("_") || [
      "Unknown",
      "Unknown",
    ];
    const scanRecord: ScanResult = {
      id: result.image_id || Math.random().toString(),
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      disease: disease || "Unknown",
      severity: result.predictions?.[0]?.severity || "Unknown",
      date: new Date().toISOString(),
      healthScore: result.overall_health_score || 0,
      predictions: result.predictions || [],
    };
    await addScan(scanRecord);
  };

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "healthy":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (!selectedPlant) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <Feather name="alert-circle" size={48} color="#94a3b8" />
          <Text
            style={[
              styles.pageSubtitle,
              { marginTop: 16, textAlign: "center" },
            ]}
          >
            Plant information not found.
          </Text>
          <TouchableOpacity onPress={handleBack} style={{ marginTop: 24 }}>
            <Text style={[styles.viewAll, { fontSize: 16 }]}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const chartLabels = plantScans.slice(-6).map((s) => {
    const date = new Date(s.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const trendData =
    selectedPlant.healthTrend.length > 0 ? selectedPlant.healthTrend : [100];
  const displayLabels = chartLabels.length > 0 ? chartLabels : ["Start"];

  const getStatusColors = (status: string): [string, string, string] => {
    switch (status) {
      case "healthy":
        return ["#059669", "#10b981", "#34d399"];
      case "warning":
        return ["#d97706", "#f59e0b", "#fbbf24"];
      case "critical":
        return ["#dc2626", "#ef4444", "#f87171"];
      default:
        return ["#475569", "#64748b", "#94a3b8"];
    }
  };

  const statusColors = getStatusColors(selectedPlant.status);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <LinearGradient
          colors={statusColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.header,
            {
              paddingTop: insets.top + 16,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            },
          ]}
        >
          <View
            style={[
              styles.detailTop,
              { paddingHorizontal: 24, marginBottom: 12 },
            ]}
          >
            <View
              style={[
                styles.detailIcon,
                {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                },
              ]}
            >
              <Text style={{ fontSize: 36 }}>
                {getPlantEmoji(selectedPlant.type)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={[
                    styles.detailMeta,
                    { color: "#fff", fontWeight: "700" },
                  ]}
                >
                  {selectedPlant.type.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.detailScore}>
                  {Math.round(selectedPlant.health)}%
                </Text>
              )}
              <Text style={[styles.detailLabel, { fontWeight: "700" }]}>
                Health
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Chart
            data={trendData}
            labels={displayLabels}
            color={statusColors[1]}
          />

          <View style={[styles.statsGrid, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="calendar"
                label="Last Check"
                value={new Date(selectedPlant.lastChecked).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                )}
                color="#3b82f6"
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="clipboard"
                label="Scans"
                value={selectedPlant.entries.toString()}
                color="#10b981"
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="alert-triangle"
                label="Status"
                value={
                  selectedPlant.status.charAt(0).toUpperCase() +
                  selectedPlant.status.slice(1)
                }
                color={statusColors[1]}
              />
            </View>
          </View>

          <Timeline scans={plantScans} />

          <View style={{ flexDirection: "row", gap: 12, marginTop: 32 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flex: 1.5 }}
              onPress={takePhoto}
              disabled={mutation.isPending}
            >
              <LinearGradient
                colors={statusColors.slice(0, 2)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 100,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: statusColors[0],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <Feather name="camera" size={28} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    marginTop: 8,
                    fontSize: 13,
                  }}
                >
                  SCAN LEAF
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#f1f5f9",
              }}
              onPress={pickImage}
              disabled={mutation.isPending}
            >
              <View
                style={{
                  backgroundColor: "#f8fafc",
                  padding: 12,
                  borderRadius: 16,
                }}
              >
                <Feather name="image" size={24} color="#64748b" />
              </View>
              <Text
                style={{
                  color: "#64748b",
                  fontWeight: "700",
                  marginTop: 6,
                  fontSize: 11,
                }}
              >
                UPLOAD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#fee2e2",
              }}
              onPress={() => setShowDeleteModal(true)}
            >
              <View
                style={{
                  backgroundColor: "#fff1f2",
                  padding: 12,
                  borderRadius: 16,
                }}
              >
                <Feather name="trash-2" size={24} color="#ef4444" />
              </View>
              <Text
                style={{
                  color: "#ef4444",
                  fontWeight: "700",
                  marginTop: 6,
                  fontSize: 11,
                }}
              >
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#fff1f2",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 16,
              }}
            >
              <Feather name="trash-2" size={24} color="#ef4444" />
            </View>

            <Text style={[styles.modalTitle, { textAlign: "center", marginBottom: 8 }]}>
              Delete Plant
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 28,
              }}
            >
              This action is permanent and cannot be undone.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalButton, { backgroundColor: "#ef4444", width: "100%", marginBottom: 10 }]}
              onPress={async () => {
                setShowDeleteModal(false);
                await deletePlant(plantId);
                router.replace("/(tabs)/tracking");
              }}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.btnSecondary, { width: "100%" }]}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Results Modal for Direct Analysis */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultsModalVisible}
        onRequestClose={() => setResultsModalVisible(false)}
      >
        <BlurView intensity={30} style={styles.modalContainer}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingVertical: 16,
              }}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { textAlign: "left", marginBottom: 0 },
                ]}
              >
                Diagnosis Results
              </Text>
              <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                <View
                  style={{
                    backgroundColor: "#f1f5f9",
                    padding: 8,
                    borderRadius: 20,
                  }}
                >
                  <Feather name="x" size={20} color="#64748b" />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 20,
              }}
            >
              {selectedImageUri && (
                <Image
                  source={{ uri: selectedImageUri }}
                  style={{
                    width: "100%",
                    height: 240,
                    borderRadius: 24,
                    marginBottom: 20,
                  }}
                  resizeMode="cover"
                />
              )}

              <View
                style={{
                  backgroundColor:
                    getStatusColor(analysisResult?.status) + "15",
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 20,
                  borderLeftWidth: 6,
                  borderLeftColor: getStatusColor(analysisResult?.status),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: "#64748b",
                        marginBottom: 4,
                      }}
                    >
                      Primary Finding
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "800",
                        color: "#1e293b",
                      }}
                    >
                      {analysisResult?.primary_disease
                        ?.split("_")[1]
                        ?.toUpperCase() || "Healthy"}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 6,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: "#1e293b",
                          }}
                        >
                          {analysisResult?.primary_disease
                            ?.split("_")[0]
                            ?.toUpperCase()}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                          marginLeft: 8,
                        }}
                      >
                        Confidence:{" "}
                        {Math.round(
                          (analysisResult?.predictions?.[0]
                            ?.disease_confidence || 0) * 100,
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "800",
                        color: getStatusColor(analysisResult?.status),
                      }}
                    >
                      {analysisResult?.overall_health_score}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "#94a3b8",
                      }}
                    >
                      HEALTH
                    </Text>
                  </View>
                </View>
              </View>

              {analysisResult?.predictions?.[0]?.recommendations && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>Recommendations</Text>
                  {analysisResult.predictions[0].recommendations.map(
                    (rec, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          marginBottom: 6,
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#dcfce7",
                            padding: 6,
                            borderRadius: 10,
                          }}
                        >
                          <Feather name="check" size={14} color="#10b981" />
                        </View>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            color: "#475569",
                            fontWeight: "500",
                          }}
                        >
                          {rec}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              )}
            </ScrollView>

            <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ width: "100%" }}
                onPress={() => setResultsModalVisible(false)}
              >
                <LinearGradient
                  colors={["#059669", "#10b981"]}
                  style={[styles.modalButton, { marginHorizontal: 0 }]}
                >
                  <Text style={styles.modalButtonText}>
                    Close & Update Stats
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
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
