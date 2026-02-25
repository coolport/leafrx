import React, { useState } from 'react';
import { ScrollView, View, Text, StatusBar, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Settings</Text>
                    <Text style={styles.pageSubtitle}>Manage your preferences</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>General</Text>
                    <View style={styles.settingsSection}>
                        <View style={[styles.settingsRow, styles.settingsRowNotLast]}>
                            <View style={styles.settingsRowInfo}>
                                <View style={[styles.settingsIconContainer, { backgroundColor: '#dbeafe' }]}>
                                    <Feather name="bell" size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.settingsLabel}>Notifications</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
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
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={darkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
                                onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
                                value={darkModeEnabled}
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>About</Text>
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
        </SafeAreaView>
    );
}
