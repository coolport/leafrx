import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { styles } from '../../constants/styles';
import { Plant } from './types';
import { Link } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';

type PlantCardProps = {
    plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
    const { colors, isDark } = useAppTheme();
    const size = 56;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (plant.health || 0) / 100;
    const offset = circumference - (progress * circumference);

    const getStatusColor = () => {
        if (plant.status === 'healthy') return '#10b981';
        if (plant.status === 'warning') return '#f59e0b';
        return '#ef4444';
    };

    const formattedDate = new Date(plant.lastChecked).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link href={`/plant/${plant.id}`} asChild>
            <TouchableOpacity 
                style={[
                    styles.plantCard, 
                    { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        borderWidth: 1,
                        // Clean up shadow for dark mode or consistent look
                        shadowOpacity: isDark ? 0 : 0.05,
                        elevation: isDark ? 0 : 2
                    }
                ]} 
                activeOpacity={0.7}
            >
                <View style={[
                    styles.plantIcon,
                    { marginRight: 12 }, // Spacing between icon and info
                    plant.status === 'healthy' && { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)' },
                    plant.status === 'warning' && { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' },
                    plant.status === 'critical' && { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)' },
                ]}>
                    <Text style={{ fontSize: 28 }}>{getPlantEmoji(plant.type)}</Text>
                </View>

                <View style={styles.plantInfo}>
                    <Text style={[styles.plantName, { color: colors.text }]} numberOfLines={1}>{plant.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.plantMeta, { color: colors.subtext }]}>{plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}</Text>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: 8 }} />
                        <Text style={[styles.lastChecked, { color: colors.subtext }]}>{formattedDate}</Text>
                    </View>
                </View>

                <View style={[styles.plantHealth, { marginLeft: 12 }]}>
                    <Svg width={size} height={size}>
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={isDark ? '#334155' : '#f1f5f9'}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={getStatusColor()}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            fill="transparent"
                            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                        />
                    </Svg>
                    <View style={{ position: 'absolute' }}>
                        <Text style={[styles.healthScoreText, { color: getStatusColor() }]}>
                            {Math.round(plant.health)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

function getPlantEmoji(type: string) {
    const t = type.toLowerCase();
    if (t.includes('mango')) return '🥭';
    if (t.includes('banana')) return '🍌';
    if (t.includes('guava')) return '🍈';
    if (t.includes('calamansi')) return '🍊';
    return '🌿';
}
