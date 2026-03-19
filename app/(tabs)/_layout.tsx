import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useColors();
  const activeColor = colors.primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: 84,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 12,
          backgroundColor: Platform.OS === "ios" ? "transparent" : colors.tabBarBackgroundAndroid,
          borderRadius: 32,
          marginHorizontal: 20,
          bottom: 24,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={80} tint={colorScheme === "dark" ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Feather name="maximize" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color }) => <Feather name="layers" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Feather name="sliders" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
