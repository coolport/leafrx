import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';
import { usePlantStore } from '../../store/usePlantStore';

export function HealthOverview() {
    const { plants } = usePlantStore();
    
    const totalPlants = plants.length;
    const healthyCount = plants.filter(p => p.status === 'healthy').length;
    const warningCount = plants.filter(p => p.status === 'warning').length;
    const criticalCount = plants.filter(p => p.status === 'critical').length;
    
    const averageHealth = totalPlants > 0 
        ? Math.round(plants.reduce((acc, p) => acc + p.health, 0) / totalPlants) 
        : 100;

    return (
        <View style={styles.healthOverview}>
            <View style={styles.healthOverviewTop}>
                <Text style={styles.healthLabel}>Farm Health Overview</Text>
                <Text style={styles.healthScore}>{totalPlants > 0 ? averageHealth : '--'}%</Text>
            </View>
            <View style={styles.healthBadges}>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.badgeText}>{healthyCount} Healthy</Text>
                </View>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                    <Text style={styles.badgeText}>{warningCount} Warning</Text>
                </View>
                <View style={styles.badge}>
                    <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.badgeText}>{criticalCount} Critical</Text>
                </View>
            </View>
        </View>
    );
}
