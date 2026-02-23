import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../constants/styles';
import { Plant } from './types';
import { Link } from 'expo-router';

type PlantCardProps = {
    plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
    return (
        <Link href={`/plant/${plant.id}`} asChild>
            <TouchableOpacity style={styles.plantCard}>
                <View style={[
                    styles.plantIcon,
                    plant.status === 'healthy' && { backgroundColor: '#dcfce7' },
                    plant.status === 'warning' && { backgroundColor: '#fef3c7' },
                    plant.status === 'critical' && { backgroundColor: '#fee2e2' },
                ]}>
                    <Text style={{ fontSize: 24 }}>🌿</Text>
                </View>
                <View style={styles.plantInfo}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantMeta}>{plant.type}</Text>
                </View>
                <View style={styles.plantHealth}>
                    <Text style={[
                        styles.healthScoreText,
                        plant.status === 'healthy' && { color: '#22c55e' },
                        plant.status === 'warning' && { color: '#eab308' },
                        plant.status === 'critical' && { color: '#ef4444' },
                    ]}>{plant.health}%</Text>
                    <Text style={styles.lastChecked}>{plant.lastChecked}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
