import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { styles } from '../../constants/styles';

export default function SettingsScreen() {
    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Settings</Text>
                <Text style={styles.pageSubtitle}>Manage your preferences</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ color: '#6b7280' }}>Settings and preferences coming soon...</Text>
            </View>
        </ScrollView>
    );
}
