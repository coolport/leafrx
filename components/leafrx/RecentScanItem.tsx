import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createStyles } from '../../constants/styles';
import { useColors } from '../../hooks/use-colors';
import { ScanResult } from './types';
import { useRouter } from 'expo-router';

type RecentScanItemProps = {
    scan: ScanResult;
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
    const router = useRouter();
    const colors = useColors();
    const styles = createStyles(colors);

    const getStatusColor = () => {
        if (scan.healthScore >= 80) return colors.success;
        if (scan.healthScore >= 60) return colors.warning;
        return colors.danger;
    };

    const statusColor = getStatusColor();
    const isHealthy = scan.disease.toLowerCase() === 'healthy';

    const handlePress = () => {
        if (scan.plantId) {
            router.push(`/plant/${scan.plantId}`);
        }
    };

    const formattedDate = new Date(scan.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });

    const displayDisease = scan.disease.charAt(0).toUpperCase() + scan.disease.slice(1).toLowerCase();

    return (
        <TouchableOpacity 
            style={[styles.recentScanCard, { paddingVertical: 14 }]} 
            onPress={handlePress} 
            disabled={!scan.plantId}
            activeOpacity={0.7}
        >
            <View style={[styles.recentScanIconContainer, { backgroundColor: statusColor + '1A', borderRadius: 16 }]}>
                <Feather 
                    name={isHealthy ? "check-circle" : "alert-circle"} 
                    size={22} 
                    color={statusColor} 
                />
            </View>

            <View style={styles.recentScanInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Text style={[styles.recentScanPlantName, { fontSize: 16 }]}>{scan.plantName || 'Unassigned'}</Text>
                    {scan.severity && !isHealthy && (
                        <View style={{ backgroundColor: statusColor + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: statusColor, textTransform: 'uppercase' }}>
                                {scan.severity}
                            </Text>
                        </View>
                    )}
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={[styles.recentScanDisease, { 
                        color: isHealthy ? colors.success : colors.textSecondary,
                        fontWeight: isHealthy ? '700' : '500',
                        fontSize: 13
                    }]}>
                        {isHealthy ? 'Healthy Condition' : displayDisease}
                    </Text>
                </View>
            </View>

            <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.recentScanDate, { fontSize: 12 }]}>{formattedDate}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: statusColor, marginRight: 2 }}>
                        {Math.round(scan.healthScore)}%
                    </Text>
                    {scan.plantId && <Feather name="chevron-right" size={14} color={colors.textMuted} />}
                </View>
            </View>
        </TouchableOpacity>
    );
}
