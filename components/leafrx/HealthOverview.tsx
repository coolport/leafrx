import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';

export function HealthOverview() {
    return (
        <View style={styles.healthOverview}>
            <View style={styles.healthOverviewTop}>
                <Text style={styles.healthLabel}>Farm Health Overview</Text>
                <Text style={styles.healthScore}>76%</Text>
            </View>
            <View style={styles.healthBadges}>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#86efac' }]} />
                    <Text style={styles.badgeText}>12 Healthy</Text>
                </View>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#fde047' }]} />
                    <Text style={styles.badgeText}>5 Warning</Text>
                </View>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#fca5a5' }]} />
                    <Text style={styles.badgeText}>2 Critical</Text>
                </View>
            </View>
        </View>
    );
}
