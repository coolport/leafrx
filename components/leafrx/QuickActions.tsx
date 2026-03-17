import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from '../../constants/styles';
import { useColors } from '../../hooks/use-colors';
import { Link } from 'expo-router';

export function QuickActions() {
    const colors = useColors();
    const styles = createStyles(colors);

    return (
        <View style={styles.quickActions}>
            <Link href="/(tabs)/scan" asChild>
                <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
                    <LinearGradient
                        colors={[colors.primaryDark, colors.primary]}
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
                        colors={['#2563eb', colors.secondary]}
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
