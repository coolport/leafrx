import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../constants/styles';
import { Link } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';

export function QuickActions() {
    const { isDark } = useAppTheme();
    
    return (
        <View style={styles.quickActions}>
            <Link href="/(tabs)/scan" asChild>
                <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
                    <LinearGradient
                        colors={isDark ? ['#065f46', '#059669'] : ['#059669', '#10b981']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionBtn}
                    >
                        <View style={styles.actionIconBg}>
                            <Feather name="camera" size={28} color="#fff" />
                        </View>
                        <Text style={styles.actionBtnText}>Scan Leaf</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Link>
            
            <Link href="/(tabs)/tracking" asChild>
                <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
                    <LinearGradient
                        colors={isDark ? ['#1e40af', '#2563eb'] : ['#2563eb', '#3b82f6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionBtn}
                    >
                        <View style={styles.actionIconBg}>
                            <Feather name="plus" size={28} color="#fff" />
                        </View>
                        <Text style={styles.actionBtnText}>Add Plant</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
