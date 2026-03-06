import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { useAppTheme } from '../../hooks/use-app-theme';

type StatCardProps = {
    icon: React.ComponentProps<typeof Feather>['name'];
    label: string;
    value: string | number;
    color: string;
};

export function StatCard({ icon, label, value, color }: StatCardProps) {
    const { colors, isDark } = useAppTheme();
    
    return (
        <View style={[
            styles.statCard, 
            { 
                paddingVertical: 16, 
                borderRadius: 20, 
                borderWidth: 0, 
                backgroundColor: colors.card, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: isDark ? 0.3 : 0.05, 
                shadowRadius: 8, 
                elevation: 2 
            }
        ]}>
            <View style={{ backgroundColor: color + '15', padding: 10, borderRadius: 14, marginBottom: 8 }}>
                <Feather name={icon} size={20} color={color} />
            </View>
            <Text style={[styles.statValue, { fontSize: 18, fontWeight: '800', color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: colors.subtext, marginTop: 4 }]}>{label}</Text>
        </View>
    );
}
