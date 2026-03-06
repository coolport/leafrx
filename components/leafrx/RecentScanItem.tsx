import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { ScanResult } from './types';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';

type RecentScanItemProps = {
    scan: ScanResult;
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
    const router = useRouter();
    const { colors, isDark } = useAppTheme();

    const getStatusColor = () => {
        if (scan.healthScore > 85) return '#10b981';
        if (scan.healthScore > 60) return '#f59e0b';
        return '#ef4444';
    };

    const handlePress = () => {
        if (scan.plantId) {
            router.push(`/plant/${scan.plantId}`);
        }
    };

    const formattedDate = new Date(scan.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });

    return (
        <TouchableOpacity 
            style={[
                styles.recentScanCard, 
                { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border,
                    borderWidth: 1,
                    // Consistent with PlantCard
                    shadowOpacity: isDark ? 0 : 0.05,
                    elevation: isDark ? 0 : 1
                }
            ]} 
            onPress={handlePress} 
            disabled={!scan.plantId}
        >
            <View style={[styles.recentScanIconContainer, { backgroundColor: getStatusColor() + '1A', marginRight: 12 }]}>
                <Feather name="shield" size={24} color={getStatusColor()} />
            </View>

            <View style={styles.recentScanInfo}>
                <Text style={[styles.recentScanPlantName, { color: colors.text }]} numberOfLines={1}>{scan.plantName || 'Unassigned'}</Text>
                <Text style={[styles.recentScanDisease, { color: colors.subtext }]} numberOfLines={1}>{scan.disease}</Text>
            </View>

            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                <Text style={[styles.recentScanDate, { color: colors.subtext }]}>{formattedDate}</Text>
                {scan.plantId && <Feather name="chevron-right" size={14} color={colors.subtext} style={{ marginTop: 4 }} />}
            </View>
        </TouchableOpacity>
    );
}
