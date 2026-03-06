import React from 'react';
import { ScrollView, View, Text, StatusBar, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';
    
    const { 
        darkMode, 
        setDarkMode, 
        notificationsEnabled, 
        setNotificationsEnabled 
    } = useSettingsStore();

    const backgroundColor = isDark ? Colors.dark.background : '#f8fafc';
    const textColor = isDark ? Colors.dark.text : '#1f2937';
    const sectionBg = isDark ? '#1e293b' : '#fff';
    const borderColor = isDark ? '#334155' : '#e5e7eb';
    const labelColor = isDark ? '#94a3b8' : '#6b7280';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#059669', '#10b981', '#34d399']}
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
                    <Text style={[styles.label, { color: labelColor }]}>General</Text>
                    <View style={[styles.settingsSection, { backgroundColor: sectionBg, borderColor }]}>
                        <View style={[styles.settingsRow, styles.settingsRowNotLast, { borderBottomColor: borderColor }]}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: isDark ? '#1e3a8a' : '#dbeafe' }]}>
                                    <Feather name="bell" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                                </View>
                                <Text style={[styles.settingsLabel, { color: textColor }]}>Notifications</Text>
                            </View>
                            <Switch
                                trackColor={{ false: isDark ? '#334155' : '#e2e8f0', true: '#10b981' }}
                                thumbColor={'#fff'}
                                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                value={notificationsEnabled}
                            />
                        </View>
                        <View style={styles.settingsRow}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: isDark ? '#0c4a6e' : '#e0f2fe' }]}>
                                    <Feather name="moon" size={20} color={isDark ? '#38bdf8' : '#0284c7'} />
                                </View>
                                <Text style={[styles.settingsLabel, { color: textColor }]}>Dark Mode</Text>
                            </View>
                            <Switch
                                trackColor={{ false: isDark ? '#334155' : '#e2e8f0', true: '#10b981' }}
                                thumbColor={'#fff'}
                                onValueChange={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
                                value={darkMode === 'dark'}
                            />
                        </View>
                    </View>

                    <Text style={[styles.label, { color: labelColor }]}>About</Text>
                    <View style={[styles.settingsSection, { backgroundColor: sectionBg, borderColor }]}>
                        <TouchableOpacity style={[styles.settingsRow, styles.settingsRowNotLast, { borderBottomColor: borderColor }]}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: isDark ? '#78350f' : '#fef3c7' }]}>
                                    <Feather name="info" size={20} color={isDark ? '#fbbf24' : '#eab308'} />
                                </View>
                                <Text style={[styles.settingsLabel, { color: textColor }]}>Version</Text>
                            </View>
                            <Text style={[styles.settingsDescription, { color: labelColor }]}>1.0.0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingsRow}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: isDark ? '#831843' : '#ffe4e6' }]}>
                                    <Feather name="heart" size={20} color={isDark ? '#fb7185' : '#f43f5e'} />
                                </View>
                                <Text style={[styles.settingsLabel, { color: textColor }]}>Support</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={isDark ? '#64748b' : '#9ca3af'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
