import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';

type StatCardProps = {
    icon: React.ComponentProps<typeof Feather>['name'];
    label: string;
    value: string | number;
    color: string;
};

export function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <View style={styles.statCard}>
            <Feather name={icon} size={24} color={color} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}
