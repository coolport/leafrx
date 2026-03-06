import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';
import { ScanResult } from './types';
import { useAppTheme } from '../../hooks/use-app-theme';

interface TimelineProps {
    scans?: ScanResult[];
}

export function Timeline({ scans = [] }: TimelineProps) {
    const { colors, isDark } = useAppTheme();

    if (scans.length === 0) {
        return (
            <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: colors.subtext, fontStyle: 'italic' }}>No scan history yet.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>

            {scans.map((scan, i) => {
                const date = new Date(scan.date);
                const status = scan.healthScore >= 80 ? 'healthy' : scan.healthScore >= 60 ? 'warning' : 'critical';
                const statusColor = status === 'healthy' ? '#22c55e' : status === 'warning' ? '#eab308' : '#ef4444';
                
                return (
                    <View key={scan.id} style={styles.timelineItem}>
                        <View style={styles.timelineDotContainer}>
                            <View style={[
                                styles.timelineDot,
                                { backgroundColor: statusColor }
                            ]} />
                            {i < scans.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <View style={styles.timelineHeader}>
                                <Text style={[styles.timelineDate, { color: colors.text }]}>{date.toLocaleDateString()}</Text>
                                <Text style={[styles.timelineTime, { color: colors.subtext }]}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>
                            <View style={[styles.timelineCard, { backgroundColor: colors.background }]}>
                                <View style={styles.timelineCardHeader}>
                                    <Text style={[styles.timelineCardLabel, { color: colors.subtext }]}>{scan.disease.toUpperCase()}</Text>
                                    <Text style={[
                                        styles.timelineCardScore,
                                        { color: statusColor }
                                    ]}>{Math.round(scan.healthScore)}%</Text>
                                </View>
                                <Text style={[styles.timelineCardNote, { color: colors.text }]}>
                                    Severity: {scan.severity}. Detected {scan.predictions.length} leaf areas.
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
