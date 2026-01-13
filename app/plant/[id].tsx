import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { myPlants, chartLabels } from '../../constants/mockData'; // Import chartLabels
import { Chart } from '../../components/leafrx/Chart';
import { StatCard } from '../../components/leafrx/StatCard';
import { Timeline } from '../../components/leafrx/Timeline';

export default function DetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const selectedPlant = myPlants.find(p => p.id.toString() === id);

    if (!selectedPlant) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Plant not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.detailTop}>
                        <View style={styles.detailIcon}>
                            <Text style={{ fontSize: 32 }}>🌿</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
                            <Text style={styles.detailMeta}>{selectedPlant.type} • {selectedPlant.location}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.detailScore}>{selectedPlant.health}%</Text>
                            <Text style={styles.detailLabel}>Health</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Chart data={selectedPlant.healthTrend} labels={chartLabels} /> {/* Pass data and labels */}

                    <View style={styles.statsGrid}>
                        <StatCard icon="trending-up" label="Days Tracked" value="45" color='#22c55e' />
                        <StatCard icon="calendar" label="Total Scans" value="23" color='#3b82f6' />
                        <StatCard icon="alert-triangle" label="Alerts" value="3" color='#eab308' />
                    </View>

                    <Timeline />

                    <TouchableOpacity style={[styles.btnPrimary, { marginTop: 16, marginBottom: 100 }]}>
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Add New Entry</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
