import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';
import { chartData, chartLabels } from '../../constants/mockData';

export function Chart() {
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Health Trend</Text>
                <View style={styles.chartSelect}>
                    <Text style={styles.chartSelectText}>Last 7 days</Text>
                </View>
            </View>
            <View style={styles.chart}>
                {chartData.map((height, i) => (
                    <View key={i} style={styles.barContainer}>
                        <View style={[styles.bar, { height: `${height}%` }]} />
                        <Text style={styles.barLabel}>{chartLabels[i]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
