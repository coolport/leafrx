import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import * as ImagePicker from "expo-image-picker";
import { AddPlantModal, plantTypes } from "../../components/leafrx/AddPlantModal";
import { AssignPlantModal } from "../../components/leafrx/AssignPlantModal";
import { AnalysisResponse, Plant, ScanResult } from "../../components/leafrx/types";
import { usePlantStore } from "../../store/usePlantStore";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { useTranslations } from "../../hooks/use-translations";
import { getHealthColor, normalizeHealthStatus } from "../../constants/health";
import { resolveDiseaseLibraryId } from "../../constants/diseaseLibrary";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  const params = useLocalSearchParams<{
    plantId?: string;
    plantType?: string;
  }>();
  const isUpdatingPlant = !!params.plantId;

  const plants = usePlantStore((state) => state.plants);
  const addScan = usePlantStore((state) => state.addScan);
  const addPlant = usePlantStore((state) => state.addPlant);

  const [isResultsModalVisible, setResultsModalVisible] = useState(false);
  const [isAddPlantModalVisible, setAddPlantModalVisible] = useState(false);
  const [isAssignPlantModalVisible, setAssignPlantModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [selectedPlantClass, setSelectedPlantClass] = useState<string | undefined>(
    isUpdatingPlant ? params.plantType : undefined
  );

  const skipAddModalReturnRef = useRef(false);

  const mutation = useMutation({
    mutationFn: ({ uri, type }: { uri: string; type?: string }) => apiService.analyzeImage(uri, type),
    onSuccess: (data) => {
      if (data.success) {
        setAnalysisResult(data);
        setResultsModalVisible(true);
      } else {
        Alert.alert(t.settings.error, data.error || "Unknown error occurred");
      }
    },
    onError: () => {
      Alert.alert(t.settings.error, "Failed to connect to the server.");
    },
  });

  const scanLinePos = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (mutation.isPending) {
      scanLinePos.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scanLinePos.value = 0;
      pulseScale.value = 1;
    }
  }, [mutation.isPending, pulseScale, scanLinePos]);

  const animatedScanStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 100}%`,
    opacity: mutation.isPending ? 1 : 0,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  useEffect(() => {
    if (params.plantId) {
      setSelectedPlantClass(params.plantType);
      return;
    }

    if (!analysisResult && !selectedImageUri) {
      setSelectedPlantClass(undefined);
    }
  }, [params.plantId, params.plantType, analysisResult, selectedImageUri]);

  const processImage = async (uri: string) => {
    setSelectedImageUri(uri);
    mutation.mutate({ uri, type: selectedPlantClass });
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

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t.settings.permissionDenied, "Camera permission is required.");
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

  const handleSaveAsNewPlant = () => {
    skipAddModalReturnRef.current = false;
    setResultsModalVisible(false);
    setAddPlantModalVisible(true);
  };

  const handleAssignToPlant = () => {
    setResultsModalVisible(false);
    setAssignPlantModalVisible(true);
  };

  const handleAddPlantModalClose = () => {
    setAddPlantModalVisible(false);

    if (skipAddModalReturnRef.current) {
      skipAddModalReturnRef.current = false;
      return;
    }

    if (analysisResult) {
      setResultsModalVisible(true);
    }
  };

  const handleAssignPlantModalClose = () => {
    setAssignPlantModalVisible(false);

    if (analysisResult) {
      setResultsModalVisible(true);
    }
  };

  const resetScanFlow = () => {
    setResultsModalVisible(false);
    setAnalysisResult(null);
    setSelectedImageUri(null);
  };

  const handleUpdatePlant = async () => {
    await saveScanToStore(params.plantId);
    resetScanFlow();
    router.back();
  };

  const onAddPlantSave = async (name: string, type: string) => {
    skipAddModalReturnRef.current = true;
    if (!analysisResult) return;
    await addPlant({
      name,
      type,
      health: analysisResult.overall_health_score || 0,
      lastChecked: new Date().toISOString(),
      status: normalizeHealthStatus(analysisResult.status, analysisResult.overall_health_score),
    });
    const updatedPlants = usePlantStore.getState().plants;
    const newPlant = updatedPlants[0];
    if (newPlant) {
      await saveScanToStore(newPlant.id);
      setAddPlantModalVisible(false);
      resetScanFlow();
      router.push(`/plant/${newPlant.id}`);
    }
  };

  const onSelectExistingPlant = async (plant: Plant) => {
    await saveScanToStore(plant.id);
    setAssignPlantModalVisible(false);
    resetScanFlow();
    router.push(`/plant/${plant.id}`);
  };

  const saveScanToStore = async (plantIdToSave?: string) => {
    if (!analysisResult) return;
    const plantInfo = usePlantStore.getState().plants.find((p) => p.id === plantIdToSave);

    // Extract disease and plant type from predictions or primary_disease
    const firstPrediction = analysisResult.predictions?.[0];
    let diseaseName = "Unknown";

    if (firstPrediction) {
      diseaseName = firstPrediction.disease;
    } else if (analysisResult.primary_disease) {
      const parts = analysisResult.primary_disease.split("_");
      diseaseName = parts.length > 1 ? parts[1] : parts[0];
    }

    // Normalize "healthy" string
    if (diseaseName.toLowerCase() === "healthy") {
      diseaseName = "Healthy";
    }

    const scanRecord: ScanResult = {
      id: analysisResult.image_id || Math.random().toString(),
      plantId: plantIdToSave,
      plantName: plantInfo?.name || "Unassigned",
      disease: diseaseName,
      severity: analysisResult.predictions?.[0]?.severity || "none",
      date: new Date().toISOString(),
      healthScore: analysisResult.overall_health_score || 0,
      status: normalizeHealthStatus(analysisResult.status, analysisResult.overall_health_score),
      predictions: analysisResult.predictions || [],
    };
    await addScan(scanRecord);
  };

  const getStatusColor = (status?: string, score?: number) => {
    return getHealthColor(normalizeHealthStatus(status, score), colors);
  };

  const openDiseaseGuide = () => {
    if (!analysisResult) return;

    const firstPred = analysisResult.predictions?.[0];
    const targetId = resolveDiseaseLibraryId({
      explicitId: analysisResult.primary_disease,
      plantType: firstPred?.plant_type || analysisResult.primary_disease?.split("_")[0],
      diseaseName:
        firstPred?.disease ||
        (analysisResult.primary_disease?.includes("_")
          ? analysisResult.primary_disease.split("_").slice(1).join("_")
          : analysisResult.primary_disease),
    });

    if (targetId) {
      router.push({
        pathname: "/library",
        params: { selectedId: targetId },
      });
    }
  };

  const detectedPlantType =
    analysisResult?.predictions?.[0]?.plant_type || analysisResult?.primary_disease?.split("_")[0];
  const filterType =
    selectedPlantClass || (detectedPlantType?.toLowerCase() === "healthy" ? undefined : detectedPlantType);
  const filteredPlantsForAssignment = filterType
    ? plants.filter((p) => p.type.toLowerCase() === filterType.toLowerCase())
    : plants;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={colors.headerGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.header,
            {
              paddingTop: insets.top + 16,
              paddingBottom: 32,
              marginBottom: 24,
            },
          ]}
        >
          <View style={[styles.headerTop, { marginBottom: 0 }]}>
            <View>
              <Text style={styles.headerTitle}>{isUpdatingPlant ? t.scan.newScan : t.scan.title}</Text>
              <Text style={styles.headerSubtitle}>
                {isUpdatingPlant
                  ? `${t.scan.forPlant}: ${plants.find((p) => p.id === params.plantId)?.name}`
                  : t.scan.subtitle}
              </Text>
            </View>
            {/* Status pill */}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                }}
              />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
                {mutation.isPending ? t.scan.scanning : t.scan.ready}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.section, { marginTop: -20 }]}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 20,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {/* ── Plant Type Selector ── */}
            {!isUpdatingPlant && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.label}>{t.scan.plantType}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingRight: 8 }}
                  style={styles.chipsScroll}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={!selectedPlantClass ? styles.chipSelected : styles.chip}
                    onPress={() => setSelectedPlantClass(undefined)}
                  >
                    <Text style={!selectedPlantClass ? styles.chipTextSelected : styles.chipText}>✦ {t.scan.auto}</Text>
                  </TouchableOpacity>
                  {plantTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      activeOpacity={0.7}
                      style={selectedPlantClass === type ? styles.chipSelected : styles.chip}
                      onPress={() => setSelectedPlantClass(type)}
                    >
                      <Text style={selectedPlantClass === type ? styles.chipTextSelected : styles.chipText}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── Viewfinder ── */}
            <Animated.View
              style={[
                styles.cameraArea,
                animatedPulseStyle,
                {
                  borderWidth: mutation.isPending ? 2 : 1,
                  borderColor: mutation.isPending ? colors.primary : colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              {selectedImageUri ? (
                <View style={{ width: "100%", height: "100%" }}>
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={[{ width: "100%", height: "100%" }, mutation.isPending && { opacity: 0.55 }]}
                  />
                  {mutation.isPending && (
                    <>
                      {/* Scan line */}
                      <Animated.View style={[styles.scanningLine, animatedScanStyle]} />
                      {/* Corner brackets */}
                      <View style={[StyleSheet.absoluteFill, { margin: 16 }]}>
                        {/* TL */}
                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 24,
                            height: 24,
                            borderTopWidth: 3,
                            borderLeftWidth: 3,
                            borderColor: colors.primary,
                            borderTopLeftRadius: 6,
                          }}
                        />
                        {/* TR */}
                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 24,
                            height: 24,
                            borderTopWidth: 3,
                            borderRightWidth: 3,
                            borderColor: colors.primary,
                            borderTopRightRadius: 6,
                          }}
                        />
                        {/* BL */}
                        <View
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: 24,
                            height: 24,
                            borderBottomWidth: 3,
                            borderLeftWidth: 3,
                            borderColor: colors.primary,
                            borderBottomLeftRadius: 6,
                          }}
                        />
                        {/* BR */}
                        <View
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 24,
                            height: 24,
                            borderBottomWidth: 3,
                            borderRightWidth: 3,
                            borderColor: colors.primary,
                            borderBottomRightRadius: 6,
                          }}
                        />
                      </View>
                      {/* Center overlay */}
                      <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
                        <View
                          style={{
                            backgroundColor: colors.modalBackground,
                            borderRadius: 20,
                            paddingHorizontal: 24,
                            paddingVertical: 16,
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <ActivityIndicator size="large" color={colors.primary} />
                          <Text
                            style={{
                              color: "#fff",
                              fontWeight: "800",
                              fontSize: 14,
                              letterSpacing: 1,
                            }}
                          >
                            {t.scan.analyzing}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ) : (
                /* Empty state */
                <View
                  style={{
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    gap: 0,
                  }}
                >
                  <View style={styles.scannerFrame} />
                  {/* Icon bubble */}
                  <View
                    style={{
                      width: 76,
                      height: 76,
                      backgroundColor: `${colors.primary}1A`,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: `${colors.primary}33`,
                    }}
                  >
                    <Feather name="camera" size={34} color={colors.primary} />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: colors.text,
                      letterSpacing: -0.3,
                    }}
                  >
                    {t.scan.viewfinder}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textMuted,
                      marginTop: 4,
                      fontWeight: "500",
                    }}
                  >
                    {t.scan.viewfinderSub}
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* ── Image source label ── */}
            {selectedImageUri && !mutation.isPending && (
              <TouchableOpacity
                onPress={() => setSelectedImageUri(null)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 12,
                  gap: 6,
                }}
              >
                <Feather name="refresh-ccw" size={13} color={colors.textMuted} />
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontWeight: "600",
                  }}
                >
                  {t.scan.clearRescan}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Action Buttons ── */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
            {/* Take Photo — primary */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={takePhoto}
              disabled={mutation.isPending}
              style={{ flex: 1.5, opacity: mutation.isPending ? 0.55 : 1 }}
            >
              <LinearGradient
                colors={[colors.primaryDark, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.btnPrimary, { height: 60, borderRadius: 20 }]}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: 6,
                    borderRadius: 10,
                  }}
                >
                  <Feather name="camera" size={18} color="#fff" />
                </View>
                <Text style={styles.btnPrimaryText}>{t.scan.takePhoto}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Gallery — secondary */}
            <TouchableOpacity
              style={[
                styles.btnSecondary,
                {
                  flex: 1,
                  height: 60,
                  borderRadius: 20,
                  opacity: mutation.isPending ? 0.55 : 1,
                },
              ]}
              onPress={pickImage}
              disabled={mutation.isPending}
              activeOpacity={0.7}
            >
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Feather name="image" size={16} color={colors.textSecondary} />
              </View>
              <Text style={styles.btnSecondaryText}>{t.scan.gallery}</Text>
            </TouchableOpacity>
          </View>

          {/* ── How it works ── */}
          {!selectedImageUri && (
            <View
              style={{
                marginTop: 24,
                backgroundColor: colors.card,
                borderRadius: 20,
                padding: 20,
                shadowColor: colors.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={[styles.label, { marginBottom: 16 }]}>{t.scan.howItWorks}</Text>
              {[
                {
                  icon: "camera",
                  step: "01",
                  title: t.scan.step1Title,
                  desc: t.scan.step1Desc,
                },
                {
                  icon: "cpu",
                  step: "02",
                  title: t.scan.step2Title,
                  desc: t.scan.step2Desc,
                },
                {
                  icon: "clipboard",
                  step: "03",
                  title: t.scan.step3Title,
                  desc: t.scan.step3Desc,
                },
              ].map((item, i) => (
                <View
                  key={item.step}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 14,
                    marginBottom: i < 2 ? 16 : 0,
                  }}
                >
                  {/* Step number + icon */}
                  <View style={{ alignItems: "center", gap: 4 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: `${colors.primary}1A`,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: `${colors.primary}33`,
                      }}
                    >
                      <Feather name={item.icon as any} size={18} color={colors.primary} />
                    </View>
                    {i < 2 && (
                      <View
                        style={{
                          width: 2,
                          height: 16,
                          backgroundColor: colors.border,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingTop: 4 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "800",
                          color: colors.primary,
                          letterSpacing: 1,
                        }}
                      >
                        {item.step}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        lineHeight: 18,
                        fontWeight: "500",
                      }}
                    >
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Results Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultsModalVisible}
        onRequestClose={() => setResultsModalVisible(false)}
      >
        <BlurView intensity={30} tint={colors.card === "#ffffff" ? "light" : "dark"} style={styles.modalContainer}>
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHandle} />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingBottom: 16,
              }}
            >
              <View>
                <Text style={styles.modalTitle}>{t.scan.resultsTitle}</Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  {t.scan.aiAnalysis}
                </Text>
              </View>
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
              {/* Scanned image */}
              {selectedImageUri && (
                <View style={{ marginBottom: 20 }}>
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={{ width: "100%", height: 220, borderRadius: 24 }}
                    resizeMode="cover"
                  />
                  {/* Health score badge over image */}
                  {analysisResult && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 16,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: getStatusColor(analysisResult?.status, analysisResult?.overall_health_score),
                        }}
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: 13,
                        }}
                      >
                        {t.home[normalizeHealthStatus(analysisResult?.status, analysisResult?.overall_health_score)]} {t.healthLevels.label}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {analysisResult && (
                <>
                  {/* Primary finding card */}
                  <View
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 24,
                      padding: 18,
                      marginBottom: 16,
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
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "800",
                          color: colors.textMuted,
                          letterSpacing: 1.3,
                          textTransform: "uppercase",
                        }}
                      >
                        {t.scan.primaryFinding}
                      </Text>
                      <View
                        style={{
                          backgroundColor:
                            getStatusColor(analysisResult?.status, analysisResult?.overall_health_score) + "18",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "800",
                            color: getStatusColor(analysisResult?.status, analysisResult?.overall_health_score),
                            textTransform: "uppercase",
                          }}
                        >
                          {t.home[normalizeHealthStatus(analysisResult?.status, analysisResult?.overall_health_score)]}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: "800",
                        color: colors.text,
                        letterSpacing: -0.5,
                        marginBottom: 12,
                      }}
                    >
                      {(
                        analysisResult?.predictions?.[0]?.disease ||
                        (analysisResult?.primary_disease?.includes("_")
                          ? analysisResult.primary_disease.split("_")[1]
                          : analysisResult?.primary_disease) ||
                        "Healthy"
                      ).toUpperCase()}
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <View
                        style={{
                          backgroundColor: colors.background,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: colors.textSecondary,
                          }}
                        >
                          {(
                            analysisResult?.predictions?.[0]?.plant_type ||
                            analysisResult?.primary_disease?.split("_")[0] ||
                            ""
                          ).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Recommendations */}
                  {analysisResult?.predictions?.[0]?.recommendations && (
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.label}>{t.scan.recommendations}</Text>
                      {analysisResult.predictions[0].recommendations.map((rec, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            marginBottom: 10,
                            gap: 12,
                            alignItems: "flex-start",
                            backgroundColor: colors.background,
                            borderRadius: 14,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: `${colors.success}1A`,
                              padding: 6,
                              borderRadius: 10,
                              marginTop: 1,
                            }}
                          >
                            <Feather name="check" size={13} color={colors.success} />
                          </View>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              color: colors.textSecondary,
                              fontWeight: "500",
                              lineHeight: 20,
                            }}
                          >
                            {rec}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            {/* CTA buttons */}
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: 40,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              {isUpdatingPlant ? (
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                    onPress={openDiseaseGuide}
                  >
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
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleUpdatePlant}>
                    <LinearGradient
                      colors={[colors.primaryDark, colors.primary] as any}
                      style={[styles.modalButton, { marginHorizontal: 0 }]}
                    >
                      <Text style={styles.modalButtonText}>{t.scan.updateInfo}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ width: "100%", marginBottom: 12 }}
                    onPress={openDiseaseGuide}
                  >
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
                      <Feather name="book-open" size={18} color={colors.textSecondary} />
                      <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Disease Guide</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleAssignToPlant}>
                      <View
                        style={[
                          styles.modalButton,
                          {
                            backgroundColor: colors.background,
                            marginHorizontal: 0,
                            borderWidth: 1,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>{t.scan.assignExisting}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleSaveAsNewPlant}>
                      <LinearGradient
                        colors={[colors.primaryDark, colors.primary] as any}
                        style={[styles.modalButton, { marginHorizontal: 0 }]}
                      >
                        <Text style={styles.modalButtonText}>{t.scan.saveAsNew}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </BlurView>
      </Modal>

      <AddPlantModal
        isVisible={isAddPlantModalVisible}
        onClose={handleAddPlantModalClose}
        onSave={onAddPlantSave}
        initialPlantType={filterType}
      />

      <AssignPlantModal
        isVisible={isAssignPlantModalVisible}
        onClose={handleAssignPlantModalClose}
        plants={filteredPlantsForAssignment}
        onSelectPlant={onSelectExistingPlant}
      />
    </View>
  );
}
