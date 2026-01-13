import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { Link } from 'expo-router';

export function QuickActions() {
    return (
        <View style={styles.quickActions}>
            <Link href="/(tabs)/scan" asChild>
                <TouchableOpacity style={{...styles.actionBtn, backgroundColor: '#22c55e'}}>
                    <Feather name="camera" size={32} color="#fff" />
                    <Text style={styles.actionBtnText}>Scan Leaf</Text>
                </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/tracking" asChild>
                <TouchableOpacity style={{...styles.actionBtn, backgroundColor: '#3b82f6'}}>
                    <Feather name="plus" size={32} color="#fff" />
                    <Text style={styles.actionBtnText}>Add Plant</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
