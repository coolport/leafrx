import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';

type ChartProps = {
    data: number[]; // e.g., [70, 75, 80, ...] (percentages)
    labels: string[];
};

export function Chart({ data, labels }: ChartProps) {
    const chartHeight = 200; // Corresponds to styles.chart.height

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Health Trend</Text>
                <View style={styles.chartSelect}>
                    <Text style={styles.chartSelectText}>Last 7 days</Text>
                </View>
            </View>
            <View style={styles.chart}>
                {data.map((value, i) => (
                    <View key={i} style={styles.barContainer}>
                        <View
                            style={[
                                styles.bar,
                                { height: (value / 100) * chartHeight }, // Calculate actual pixel height
                            ]}
                        />
                        <Text style={styles.barLabel}>{labels[i]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
