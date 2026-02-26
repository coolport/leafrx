import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';

type ChartProps = {
    data: number[]; // e.g., [70, 75, 80, ...] (percentages)
    labels: string[];
    color?: string;
};

export function Chart({ data, labels, color = '#10b981' }: ChartProps) {
    const chartHeight = 160; // Slightly smaller for better proportions

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Health History</Text>
                <View style={[styles.chartSelect, { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 0 }]}>
                    <Text style={[styles.chartSelectText, { fontSize: 12, fontWeight: '700', color: '#64748b' }]}>Historical</Text>
                </View>
            </View>
            <View style={[styles.chart, { height: chartHeight + 40, alignItems: 'flex-end', paddingTop: 20 }]}>
                {data.map((value, i) => (
                    <View key={i} style={[styles.barContainer, { height: '100%', justifyContent: 'flex-end' }]}>
                        <View
                            style={[
                                styles.bar,
                                { 
                                    height: (value / 100) * chartHeight,
                                    backgroundColor: color,
                                    borderRadius: 8,
                                    width: 14,
                                },
                            ]}
                        />
                        <Text style={[styles.barLabel, { marginTop: 8, fontWeight: '600', fontSize: 10 }]}>{labels[i]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
