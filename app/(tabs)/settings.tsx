import React, { useState } from "react";
import { ScrollView, Image, View, Text, StatusBar, Switch, TouchableOpacity, Alert, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createStyles } from "../../constants/styles";
import { useColors } from "../../hooks/use-colors";
import { Feather } from "@expo/vector-icons";
import { usePlantStore } from "../../store/usePlantStore";
import { notificationService } from "../../services/notifications";
import { useTranslations } from "../../hooks/use-translations";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = createStyles(colors);
  const settings = usePlantStore((state) => state.settings);
  const updateSettings = usePlantStore((state) => state.updateSettings);
  const { t, language } = useTranslations();
  const [isSupportModalVisible, setSupportModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          await notificationService.scheduleReminders();
          await updateSettings({ notifications: true });
        } else {
          Alert.alert(t.settings.permissionDenied, t.settings.enableNotificationsMsg, [{ text: "OK" }]);
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

  const toggleDarkMode = (value: boolean) => {
    updateSettings({ darkMode: value });
  };

  const handleLanguageSelect = (lang: "en" | "fil") => {
    updateSettings({ language: lang });
    setLanguageModalVisible(false);
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
            <Text style={styles.headerTitle}>{t.settings.title}</Text>
            <Text style={styles.headerSubtitle}>{t.settings.subtitle}</Text>
          </View>
        </LinearGradient>

        <View style={[styles.section, { marginTop: 0 }]}>
          <Text style={styles.label}>{t.settings.general}</Text>
          <View style={styles.settingsSection}>
            <View style={[styles.settingsRow, styles.settingsRowNotLast]}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#dbeafe" }]}>
                  <Feather name="bell" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.notifications}</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={"#fff"}
                onValueChange={toggleNotifications}
                value={settings.notifications}
              />
            </View>
            <View style={[styles.settingsRow, styles.settingsRowNotLast]}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#e0f2fe" }]}>
                  <Feather name="moon" size={20} color="#0284c7" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.darkMode}</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={"#fff"}
                onValueChange={toggleDarkMode}
                value={settings.darkMode}
              />
            </View>
            <TouchableOpacity style={styles.settingsRow} onPress={() => setLanguageModalVisible(true)}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#f0fdf4" }]}>
                  <Feather name="globe" size={20} color="#22c55e" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.language}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.settingsDescription}>{language === "en" ? "English" : "Filipino"}</Text>
                <Feather name="chevron-right" size={20} color={colors.textMuted} style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t.settings.about}</Text>
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={[styles.settingsRow, styles.settingsRowNotLast]}
              onPress={async () => {
                if (settings.notifications) {
                  await notificationService.sendTestNotification();
                } else {
                  Alert.alert(t.settings.notificationsDisabled, t.settings.enableFirstMsg);
                }
              }}
            >
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#fef3c7" }]}>
                  <Feather name="zap" size={20} color="#eab308" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.sendTestNotification}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingsRow, styles.settingsRowNotLast]}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#fef3c7" }]}>
                  <Feather name="info" size={20} color="#eab308" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.version}</Text>
              </View>
              <Text style={styles.settingsDescription}>1.0.0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsRow} onPress={() => setSupportModalVisible(true)}>
              <View style={styles.settingsRowInfo}>
                <View style={[styles.settingsIconContainer, { backgroundColor: "#ffe4e6" }]}>
                  <Feather name="heart" size={20} color="#f43f5e" />
                </View>
                <Text style={styles.settingsLabel}>{t.settings.support}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { textAlign: "center", marginBottom: 24 }]}>{t.settings.selectLanguage}</Text>

            <View style={{ gap: 12, marginBottom: 24 }}>
              {[
                { code: "en", label: "English", sub: "US English" },
                { code: "fil", label: "Filipino", sub: "Tagalog" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => handleLanguageSelect(item.code as any)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: language === item.code ? `${colors.primary}10` : colors.background,
                    borderWidth: 1,
                    borderColor: language === item.code ? colors.primary : colors.border,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: language === item.code ? colors.primary : colors.text,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.sub}</Text>
                  </View>
                  {language === item.code && <Feather name="check-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setLanguageModalVisible(false)}
              style={{
                backgroundColor: colors.border,
                paddingVertical: 15,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: "700", fontSize: 15 }}>{t.settings.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              {t.settings.tagline}
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
                { name: "Aidan Alcayde", role: t.settings.teamRole },
                { name: "Rod Manzon", role: t.settings.frontendRole },
                { name: "Rhonnmark Helorentino", role: t.settings.frontendRole },
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
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{t.settings.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
