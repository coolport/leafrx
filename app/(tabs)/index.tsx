import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { HealthOverview } from "../../components/leafrx/HealthOverview";
import { QuickActions } from "../../components/leafrx/QuickActions";
import { PlantCard } from "../../components/leafrx/PlantCard";
import { RecentScanItem } from "../../components/leafrx/RecentScanItem";
import { Link } from "expo-router";
import { usePlantStore } from "../../store/usePlantStore";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { notificationService } from "../../services/notifications";
import { useTranslations } from "../../hooks/use-translations";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = createStyles(colors);
  const { t } = useTranslations();
  
  const plants = usePlantStore((state) => state.plants);
  const scans = usePlantStore((state) => state.scans);
  const settings = usePlantStore((state) => state.settings);
  const updateSettings = usePlantStore((state) => state.updateSettings);

  const toggleNotifications = async () => {
    const newValue = !settings.notifications;
    try {
      if (newValue) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          await notificationService.scheduleReminders();
          await updateSettings({ notifications: true });
        } else {
          Alert.alert(
            t.settings.permissionDenied,
            t.settings.enableNotificationsMsg,
            [{ text: "OK" }]
          );
        }
      } else {
        await notificationService.cancelAll();
        await updateSettings({ notifications: false });
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert(t.settings.error, t.settings.failedUpdateSettings);
    }
  };

  const { data: apiStatus } = useQuery({
    queryKey: ["api-health"],
    queryFn: () => apiService.getHealth(),
    refetchInterval: 60000, // Check every minute
  });

  const isApiOnline = apiStatus?.status === "ok";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <LinearGradient
          colors={colors.headerGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={styles.headerTitle}>LeafRx</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.15)",
                    marginTop: 6, // Slight offset to feel like a subscript
                  }}
                >
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: isApiOnline ? "#4ade80" : "#f87171",
                      marginRight: 4,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 8,
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {isApiOnline ? "Online" : "Offline"}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7} onPress={toggleNotifications}>
              <Feather name={settings.notifications ? "bell" : "bell-off"} size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <HealthOverview />
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>{t.home.quickActions}</Text>
          <QuickActions />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.home.myPlants}</Text>
            {plants.length > 0 && (
              <Link href="/(tabs)/tracking" asChild>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text style={styles.viewAll}>{t.home.viewAll} →</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>

          {plants.length > 0 ? (
            plants.slice(0, 3).map((plant) => <PlantCard key={plant.id} plant={plant} />)
          ) : (
            <View
              style={{
                padding: 32,
                backgroundColor: colors.card,
                borderRadius: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Feather name="plus-circle" size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 15,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                {t.home.noPlants}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>{t.home.recentScans}</Text>
          {scans.length > 0 ? (
            scans.slice(0, 5).map((scan) => <RecentScanItem key={scan.id} scan={scan} />)
          ) : (
            <View
              style={{
                padding: 20,
                backgroundColor: "transparent",
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>{t.home.noScans}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
