import React, { useState } from 'react';
import { ScrollView, View, Text, StatusBar, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
        <View style={styles.container}>
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
                    <Text style={styles.label}>General</Text>
                    <View style={styles.settingsSection}>
                        <View style={[styles.settingsRow, styles.settingsRowNotLast]}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: '#dbeafe' }]}>
                                    <Feather name="bell" size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.settingsLabel}>Notifications</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                                thumbColor={'#fff'}
                                onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
                                value={notificationsEnabled}
                            />
                        </View>
                        <View style={styles.settingsRow}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: '#e0f2fe' }]}>
                                    <Feather name="moon" size={20} color="#0284c7" />
                                </View>
                                <Text style={styles.settingsLabel}>Dark Mode</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                                thumbColor={'#fff'}
                                onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
                                value={darkModeEnabled}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>About</Text>
                    <View style={styles.settingsSection}>
                        <TouchableOpacity style={[styles.settingsRow, styles.settingsRowNotLast]}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: '#fef3c7' }]}>
                                    <Feather name="info" size={20} color="#eab308" />
                                </View>
                                <Text style={styles.settingsLabel}>Version</Text>
                            </View>
                            <Text style={styles.settingsDescription}>1.0.0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingsRow}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: '#ffe4e6' }]}>
                                    <Feather name="heart" size={20} color="#f43f5e" />
                                </View>
                                <Text style={styles.settingsLabel}>Support</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
