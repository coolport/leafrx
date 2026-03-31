import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Chart } from "../../components/leafrx/Chart";
import { StatCard } from "../../components/leafrx/StatCard";
import { Timeline } from "../../components/leafrx/Timeline";
import { usePlantStore } from "../../store/usePlantStore";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { AnalysisResponse, ScanResult } from "../../components/leafrx/types";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";
import { useTranslations } from "../../hooks/use-translations";
import { resolveDiseaseLibraryId } from "../../constants/diseaseLibrary";

export default function DetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  const { id } = useLocalSearchParams();
  const plantId = Array.isArray(id) ? id[0] : id;

  const plants = usePlantStore((state) => state.plants);
  const allScans = usePlantStore((state) => state.scans);
  const allEntries = usePlantStore((state) => state.plantEntries);
  const deletePlant = usePlantStore((state) => state.deletePlant);
  const updatePlant = usePlantStore((state) => state.updatePlant);
  const addScan = usePlantStore((state) => state.addScan);
  const addPlantEntry = usePlantStore((state) => state.addPlantEntry);

  const selectedPlant = useMemo(() => plants.find((p) => p.id === plantId), [plants, plantId]);
  const plantScans = useMemo(() => allScans.filter((s) => s.plantId === plantId), [allScans, plantId]);
  const plantEntries = useMemo(() => allEntries.filter((e) => e.plantId === plantId), [allEntries, plantId]);

  const growthVigor = useMemo(() => {
    if (plantScans.length < 1) {
      return {
        label: t.vigor.baseline,
        sub: t.vigor.baselineSub,
        color: colors.textMuted,
        icon: "target",
      };
    }

    const latestStatus = normalizeHealthStatus(plantScans[0].status, plantScans[0].healthScore);

    // 1. Declining Vigor: Last 2 Scans = Warning OR Critical (Diseased)
    if (plantScans.length >= 2) {
      const prevStatus = normalizeHealthStatus(plantScans[1].status, plantScans[1].healthScore);
      const isLatestStressed = latestStatus === "warning" || latestStatus === "diseased";
      const isPrevStressed = prevStatus === "warning" || prevStatus === "diseased";

      if (isLatestStressed && isPrevStressed) {
        return {
          label: t.vigor.declining,
          sub: t.vigor.decliningSub,
          color: colors.danger,
          icon: "trending-down",
        };
      }
    }

    // 2. Optimal Growth: Current = Healthy AND (Previous = Warning OR Critical)
    if (plantScans.length >= 2 && latestStatus === "healthy") {
      const prevStatus = normalizeHealthStatus(plantScans[1].status, plantScans[1].healthScore);
      if (prevStatus === "warning" || prevStatus === "diseased") {
        return {
          label: t.vigor.optimal,
          sub: t.vigor.optimalSub,
          color: colors.primary,
          icon: "trending-up",
        };
      }
    }

    // 3. Maintained Growth: Last 3 Scans = Healthy
    if (plantScans.length >= 3) {
      const s1 = latestStatus;
      const s2 = normalizeHealthStatus(plantScans[1].status, plantScans[1].healthScore);
      const s3 = normalizeHealthStatus(plantScans[2].status, plantScans[2].healthScore);
      if (s1 === "healthy" && s2 === "healthy" && s3 === "healthy") {
        return {
          label: t.vigor.maintained,
          sub: t.vigor.maintainedSub,
          color: colors.success,
          icon: "activity",
        };
      }
    }

    return {
      label: t.vigor.baseline,
      sub: t.vigor.baselineSub,
      color: colors.textSecondary,
      icon: "target",
    };
  }, [plantScans, colors, t]);

  const healthStatus = selectedPlant ? normalizeHealthStatus(selectedPlant.status, selectedPlant.health) : "warning";
  const healthColor = getHealthColor(healthStatus, colors);

  const [isResultsModalVisible, setResultsModalVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryNote, setEntryNote] = useState("");
  const [entryImageUri, setEntryImageUri] = useState<string | null>(null);
  const [newName, setNewName] = useState(selectedPlant?.name || "");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const mutation = useMutation({
    mutationFn: ({ uri, type }: { uri: string; type?: string }) => apiService.analyzeImage(uri, type),
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
      // allowsEditing: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) processImage(result.assets[0].uri);
  };

  const updateProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && selectedPlant) {
      await updatePlant(selectedPlant.id, { imageUri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) processImage(result.assets[0].uri);
  };

  const saveScanToStore = async (result: AnalysisResponse) => {
    if (!selectedPlant) return;

    // Extract disease and plant type from predictions or primary_disease
    const firstPrediction = result.predictions?.[0];
    let diseaseName = "Unknown";

    if (firstPrediction) {
      diseaseName = firstPrediction.disease;
    } else if (result.primary_disease) {
      const parts = result.primary_disease.split("_");
      diseaseName = parts.length > 1 ? parts[1] : parts[0];
    }

    // Normalize "healthy" string
    if (diseaseName.toLowerCase() === "healthy") {
      diseaseName = "Healthy";
    }

    const scanRecord: ScanResult = {
      id: result.image_id || Math.random().toString(),
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      disease: diseaseName,
      severity: result.predictions?.[0]?.severity || "none",
      date: new Date().toISOString(),
      healthScore: result.overall_health_score || 0,
      status: normalizeHealthStatus(result.status, result.overall_health_score),
      predictions: result.predictions || [],
      primary_disease: result.primary_disease,
      imageUri: selectedImageUri || undefined,
    };
    await addScan(scanRecord);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRename = async () => {
    if (newName.trim() && selectedPlant) {
      await updatePlant(selectedPlant.id, { name: newName.trim() });
      setShowRenameModal(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!entryNote.trim()) {
      Alert.alert("Error", "Please enter a note for your entry.");
      return;
    }

    if (selectedPlant) {
      await addPlantEntry({
        plantId: selectedPlant.id,
        note: entryNote.trim(),
        imageUri: entryImageUri || undefined,
      });
      setShowEntryModal(false);
      setEntryNote("");
      setEntryImageUri(null);
    }
  };

  const pickEntryImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setEntryImageUri(result.assets[0].uri);
  };

  const takeEntryPhoto = async () => {
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
    if (!result.canceled) setEntryImageUri(result.assets[0].uri);
  };

  const getStatusColor = (status?: string, score?: number) => {
    return getHealthColor(normalizeHealthStatus(status, score), colors);
  };

  const analysisPrediction = analysisResult?.predictions?.[0];
  const analysisDisease =
    analysisPrediction?.disease ||
    (analysisResult?.primary_disease?.includes("_") ? analysisResult.primary_disease.split("_")[1] : analysisResult?.primary_disease) ||
    "Healthy";
  const analysisPlantType =
    analysisPrediction?.plant_type || analysisResult?.primary_disease?.split("_")[0] || selectedPlant?.type || "";

  const handleAnalysisLibraryNav = () => {
    if (!analysisResult) return;

    const targetId = resolveDiseaseLibraryId({
      explicitId: analysisResult.primary_disease,
      plantType: analysisPrediction?.plant_type,
      diseaseName: analysisPrediction?.disease || analysisDisease,
    });

    if (targetId) {
      router.push({
        pathname: "/library",
        params: { selectedId: targetId },
      });
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
          <Feather name="alert-circle" size={48} color={colors.textMuted} />
          <Text style={[styles.pageSubtitle, { marginTop: 16, textAlign: "center" }]}>
            Plant information not found.
          </Text>
          <TouchableOpacity onPress={handleBack} style={{ marginTop: 24 }}>
            <Text style={[styles.viewAll, { fontSize: 16 }]}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const historyScans = [...plantScans].slice(0, 6).reverse();
  const chartStatuses =
    historyScans.length > 0
      ? historyScans.map((scan) => normalizeHealthStatus(scan.status, scan.healthScore))
      : [normalizeHealthStatus(selectedPlant.status, selectedPlant.health)];
  const chartLabels =
    historyScans.length > 0
      ? historyScans.map((scan) => {
          const date = new Date(scan.date);
          return String(date.getMonth() + 1) + "/" + String(date.getDate());
        })
      : ["Latest"];

  const getStatusColors = (status: string): [string, string, string] => {
    switch (status) {
      case "healthy":
        return ["#059669", "#10b981", "#34d399"];
      case "warning":
        return ["#d97706", "#f59e0b", "#fbbf24"];
      case "diseased":
        return ["#dc2626", "#ef4444", "#f87171"];
      default:
        return ["#475569", "#64748b", "#94a3b8"];
    }
  };

  const statusColors = getStatusColors(normalizeHealthStatus(selectedPlant.status, selectedPlant.health));

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
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
          <View style={[styles.detailTop, { paddingHorizontal: 24, marginBottom: 12 }]}>
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={updateProfilePicture}
                style={[
                  styles.detailIcon,
                  {
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.3)",
                    overflow: "hidden",
                  },
                ]}
              >
                {selectedPlant.imageUri ? (
                  <Image source={{ uri: selectedPlant.imageUri }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <Text style={{ fontSize: 36 }}>{getPlantEmoji(selectedPlant.type)}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={updateProfilePicture}
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  padding: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <Feather name="edit-2" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
                <TouchableOpacity onPress={() => {
                  setNewName(selectedPlant.name);
                  setShowRenameModal(true);
                }}>
                  <Feather name="edit-2" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={[styles.detailMeta, { color: "#fff", fontWeight: "700" }]}>
                  {selectedPlant.type.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                <Text style={{ color: "#fff", fontWeight: "900", fontSize: 24, lineHeight: 28 }}>
                  {Math.max(0, selectedPlant.entries - 1)}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontWeight: "800", fontSize: 11, textTransform: "uppercase" }}>
                  Scans
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Feather name="clock" size={10} color="rgba(255,255,255,0.6)" />
                <Text style={{ color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 10, textTransform: "uppercase" }}>
                  {getRelativeTime(selectedPlant.lastChecked)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Chart statuses={chartStatuses} labels={chartLabels} />

          <View style={[styles.statsGrid, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="calendar"
                label="Last Check"
                value={new Date(selectedPlant.lastChecked).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
                color={colors.secondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="clipboard"
                label="Scans"
                value={Math.max(0, selectedPlant.entries - 1).toString()}
                color={colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="alert-triangle"
                label="Latest"
                value={t.home[healthStatus]}
                color={healthColor}
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                backgroundColor: `${growthVigor.color}15`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={growthVigor.icon as any} size={24} color={growthVigor.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "800",
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Growth Analysis
                </Text>
                <Feather name="info" size={10} color={colors.textMuted} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: colors.text,
                  letterSpacing: -0.5,
                  marginBottom: 1,
                }}
              >
                {growthVigor.label}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: "500" }}>{growthVigor.sub}</Text>
            </View>
          </View>

          <Timeline scans={plantScans} entries={plantEntries} />

          <View style={{ marginTop: 32, paddingBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
              }}
              onPress={() => setShowDeleteModal(true)}
            >
              <Feather name="trash-2" size={14} color={`${colors.danger}80`} />
              <Text style={{ color: colors.danger, fontWeight: "600", fontSize: 13, opacity: 0.5 }}>
                Delete Plant Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <BlurView
        intensity={80}
        tint={colors.card === "#ffffff" ? "light" : "dark"}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 12,
          paddingTop: 12,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 52,
            height: 52,
            backgroundColor: colors.card,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => {
            setEntryNote("");
            setEntryImageUri(null);
            setShowEntryModal(true);
          }}
        >
          <Feather name="edit-3" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1 }}
          onPress={takePhoto}
          disabled={mutation.isPending}
        >
          <LinearGradient
            colors={statusColors.slice(0, 2) as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 52,
              borderRadius: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              shadowColor: statusColors[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather name="camera" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Scan Leaf</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 52,
            height: 52,
            backgroundColor: colors.card,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={pickImage}
          disabled={mutation.isPending}
        >
          <Feather name="image" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </BlurView>

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
                backgroundColor: `${colors.danger}1A`,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 16,
              }}
            >
              <Feather name="trash-2" size={24} color={colors.danger} />
            </View>

            <Text style={[styles.modalTitle, { textAlign: "center", marginBottom: 8 }]}>Delete Plant</Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 28,
              }}
            >
              This action is permanent and cannot be undone.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.modalButton,
                {
                  backgroundColor: colors.danger,
                  width: "100%",
                  marginBottom: 10,
                },
              ]}
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

      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { textAlign: "center", marginBottom: 16 }]}>Rename Plant</Text>

            <TextInput
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24,
              }}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.btnSecondary, { flex: 1 }]}
                onPress={() => setShowRenameModal(false)}
              >
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.btnSecondary, { flex: 1 }]}
                onPress={handleRename}
              >
                <Text style={styles.btnSecondaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEntryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEntryModal(false)}
      >
        <BlurView intensity={30} tint={colors.card === "#ffffff" ? "light" : "dark"} style={styles.modalContainer}>
          <View style={[styles.bottomSheetContent, { minHeight: 400 }]}>
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
              <Text style={[styles.modalTitle, { textAlign: "left", marginBottom: 0 }]}>New Journal Entry</Text>
              <TouchableOpacity onPress={() => setShowEntryModal(false)}>
                <View style={{ backgroundColor: colors.background, padding: 8, borderRadius: 20 }}>
                  <Feather name="x" size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
              <TextInput
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 20,
                  padding: 16,
                  fontSize: 16,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 120,
                  textAlignVertical: "top",
                  marginBottom: 20,
                }}
                value={entryNote}
                onChangeText={setEntryNote}
                placeholder="How is your plant doing today?"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />

              <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    borderRadius: 16,
                    padding: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onPress={takeEntryPhoto}
                >
                  <Feather name="camera" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: "700" }}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    borderRadius: 16,
                    padding: 12,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onPress={pickEntryImage}
                >
                  <Feather name="image" size={18} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: "700" }}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {entryImageUri && (
                <View style={{ marginBottom: 20, position: "relative" }}>
                  <Image
                    source={{ uri: entryImageUri }}
                    style={{ width: "100%", height: 200, borderRadius: 20 }}
                  />
                  <TouchableOpacity
                    onPress={() => setEntryImageUri(null)}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Feather name="trash-2" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity activeOpacity={0.8} style={{ width: "100%" }} onPress={handleSaveEntry}>
                <LinearGradient
                  colors={[colors.primaryDark, colors.primary] as any}
                  style={[styles.modalButton, { marginHorizontal: 0 }]}
                >
                  <Text style={styles.modalButtonText}>Save Entry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* Results Modal for Direct Analysis */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultsModalVisible}
        onRequestClose={() => setResultsModalVisible(false)}
      >
        <BlurView intensity={30} tint={colors.card === "#ffffff" ? "light" : "dark"} style={styles.modalContainer}>
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
              <Text style={[styles.modalTitle, { textAlign: "left", marginBottom: 0 }]}>Diagnosis Results</Text>
              <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 8,
                    borderRadius: 20,
                  }}
                >
                  <Feather name="x" size={20} color={colors.textSecondary} />
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
                  backgroundColor: colors.card,
                  borderRadius: 24,
                  padding: 18,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.08,
                  shadowRadius: 14,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      color: colors.textMuted,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    Detection
                  </Text>
                  <View
                    style={{
                      backgroundColor: getStatusColor(analysisResult?.status || "warning", analysisResult?.overall_health_score) + "18",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "800",
                        color: getStatusColor(analysisResult?.status || "warning", analysisResult?.overall_health_score),
                        textTransform: "uppercase",
                      }}
                    >
                      {analysisResult ? t.home[normalizeHealthStatus(analysisResult.status, analysisResult.overall_health_score)] : ""}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.text,
                    marginBottom: 12,
                    letterSpacing: -0.4,
                  }}
                >
                  {analysisDisease.toUpperCase()}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  {!!analysisPlantType && (
                    <View
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary }}>
                        {analysisPlantType.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 2 }}>
                  <Feather name="clock" size={13} color={colors.textMuted} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      fontWeight: "600",
                    }}
                  >
                    {new Date(analysisResult?.timestamp || Date.now()).toLocaleString()}
                  </Text>
                </View>
              </View>

              {analysisPrediction?.recommendations && analysisPrediction.recommendations.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.label}>Recommendations</Text>
                  {analysisPrediction.recommendations.map((rec, i) => (
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
                          backgroundColor: `${colors.success}1A`,
                          padding: 6,
                          borderRadius: 10,
                        }}
                      >
                        <Feather name="check" size={14} color={colors.success} />
                      </View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: colors.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        {rec || ""}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 40,
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleAnalysisLibraryNav}>
                <View
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: colors.background,
                      marginHorizontal: 0,
                      borderWidth: 1,
                      borderColor: colors.border,
                      flexDirection: "row",
                      gap: 8,
                    },
                  ]}
                >
                  <Feather name="book-open" size={16} color={colors.textSecondary} />
                  <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Guide</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => setResultsModalVisible(false)}>
                <LinearGradient colors={[colors.primaryDark, colors.primary] as any} style={[styles.modalButton, { marginHorizontal: 0 }]}> 
                  <Text style={styles.modalButtonText}>Close & Update</Text>
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
