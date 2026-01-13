import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../constants/styles';
import { timelineData } from '../../constants/mockData';

export function Timeline() {
    return (
        <View style={styles.timeline}>
            <Text style={styles.sectionTitle}>Timeline</Text>

            {timelineData.map((entry, i) => (
                <View key={i} style={styles.timelineItem}>
                    <View style={styles.timelineDotContainer}>
                        <View style={[
                            styles.timelineDot,
                            { backgroundColor: entry.status === 'healthy' ? '#22c55e' : '#eab308' }
                        ]} />
                        {i < timelineData.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                        <View style={styles.timelineHeader}>
                            <Text style={styles.timelineDate}>{entry.date}</Text>
                            <Text style={styles.timelineTime}>{entry.time}</Text>
                        </View>
                        <View style={styles.timelineCard}>
                            <View style={styles.timelineCardHeader}>
                                <Text style={styles.timelineCardLabel}>Health Score</Text>
                                <Text style={[
                                    styles.timelineCardScore,
                                    { color: entry.status === 'healthy' ? '#22c55e' : '#eab308' }
                                ]}>{entry.health}%</Text>
                            </View>
                            <Text style={styles.timelineCardNote}>{entry.note}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}
