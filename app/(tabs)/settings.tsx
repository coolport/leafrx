import React, { useState } from "react";
import { ScrollView, Image, View, Text, StatusBar, Switch, TouchableOpacity, Alert, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Feather } from "@expo/vector-icons";
import { usePlantStore } from "../../store/usePlantStore";
import { notificationService } from "../../services/notifications";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = createStyles(colors);
  const { settings, updateSettings } = usePlantStore();
  const [isSupportModalVisible, setSupportModalVisible] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          await notificationService.scheduleReminders();
          await updateSettings({ notifications: true });
          // Optional: Send a test notification to confirm
          // await notificationService.sendTestNotification();
        } else {
          Alert.alert(
            "Permission Denied",
            "Please enable notifications in your device settings to receive reminders.",
            [{ text: "OK" }]
          );
        }
      } else {
        await notificationService.cancelAll();
        await updateSettings({ notifications: false });
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      Alert.alert("Error", "Failed to update notification settings.");
    }
  };

  const toggleDarkMode = (value: boolean) => {
    updateSettings({ darkMode: value });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.headerGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 32 }]}
        >
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your preferences</Text>
          </View>
        </LinearGradient>

        <View style={[styles.section, { marginTop: 0 }]}>
          <Text style={styles.label}>General</Text>
          <View style={styles.settingsSection}>
            <View style={[styles.settingsRow, styles.settingsRowNotLast]}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#dbeafe" }]}>
                  <Feather name="bell" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.settingsLabel}>Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={"#fff"}
                onValueChange={toggleNotifications}
                value={settings.notifications}
              />
            </View>
            <View style={styles.settingsRow}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#e0f2fe" }]}>
                  <Feather name="moon" size={20} color="#0284c7" />
                </View>
                <Text style={styles.settingsLabel}>Dark Mode</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={"#fff"}
                onValueChange={toggleDarkMode}
                value={settings.darkMode}
              />
            </View>
          </View>

          <Text style={styles.label}>About</Text>
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={[styles.settingsRow, styles.settingsRowNotLast]}
              onPress={async () => {
                if (settings.notifications) {
                  await notificationService.sendTestNotification();
                } else {
                  Alert.alert("Notifications Disabled", "Enable notifications first to send a test.");
                }
              }}
            >
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#fef3c7" }]}>
                  <Feather name="zap" size={20} color="#eab308" />
                </View>
                <Text style={styles.settingsLabel}>Send Test Notification</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsRow, styles.settingsRowNotLast]}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#fef3c7" }]}>
                  <Feather name="info" size={20} color="#eab308" />
                </View>
                <Text style={styles.settingsLabel}>Version</Text>
              </View>
              <Text style={styles.settingsDescription}>1.0.0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsRow} onPress={() => setSupportModalVisible(true)}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#ffe4e6" }]}>
                  <Feather name="heart" size={20} color="#f43f5e" />
                </View>
                <Text style={styles.settingsLabel}>Support</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Support / Creators Modal */}
      <Modal
        visible={isSupportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require("../../assets/images/leafy.png")}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                alignSelf: "center",
                marginBottom: 14,
              }}
              resizeMode="cover"
            />

            {/* Title */}
            <Text style={[styles.modalTitle, { textAlign: "center", marginBottom: 4 }]}>LeafRx</Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              CS402 2026
            </Text>

            {/* Team list */}
            <View
              style={{
                backgroundColor: colors.background,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 24,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {[
                { name: "Aidan Alcayde", role: "Lead Developer" },
                { name: "Rod Manzon", role: "Frontend Developer" },
                { name: "Rhonnmark Helorentino", role: "Frontend Developer" },
              ].map((member, i, arr) => (
                <View
                  key={member.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    {member.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>{member.role}</Text>
                </View>
              ))}
            </View>

            {/* Close button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSupportModalVisible(false)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 15,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
