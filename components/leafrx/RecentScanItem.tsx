import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { Scan } from './types';

type RecentScanItemProps = {
    scan: Scan;
};

export function RecentScanItem({ scan }: RecentScanItemProps) {
    return (
        <View style={styles.scanItem}>
            <View style={styles.scanLeft}>
                <Feather name="check-circle" size={20} color={scan.color} />
                <View>
                    <Text style={styles.scanPlant}>{scan.plant}</Text>
                    <Text style={styles.scanDisease}>{scan.disease}</Text>
                </View>
            </View>
            <Text style={styles.scanDate}>{scan.date}</Text>
        </View>
    );
}
