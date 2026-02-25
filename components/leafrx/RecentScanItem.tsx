import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { ScanResult } from './types';
import { useRouter } from 'expo-router';

type RecentScanItemProps = {
    scan: ScanResult;
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
    const router = useRouter();

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
            style={styles.recentScanCard} 
            onPress={handlePress} 
            disabled={!scan.plantId}
        >
            <View style={[styles.recentScanIconContainer, { backgroundColor: getStatusColor() + '1A' }]}>
                <Feather name="shield" size={24} color={getStatusColor()} />
            </View>

            <View style={styles.recentScanInfo}>
                <Text style={styles.recentScanPlantName}>{scan.plantName || 'Unassigned'}</Text>
                <Text style={styles.recentScanDisease}>{scan.disease}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.recentScanDate}>{formattedDate}</Text>
                {scan.plantId && <Feather name="chevron-right" size={16} color="#9ca3af" style={{ marginTop: 4 }} />}
            </View>
        </TouchableOpacity>
    );
}
