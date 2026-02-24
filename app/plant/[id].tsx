import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { Chart } from '../../components/leafrx/Chart';
import { StatCard } from '../../components/leafrx/StatCard';
import { Timeline } from '../../components/leafrx/Timeline';
import { usePlantStore } from '../../store/usePlantStore';

export default function DetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const plantId = Array.isArray(id) ? id[0] : id;
    
    const { plants, getPlantScans, deletePlant } = usePlantStore();
    const selectedPlant = plants.find(p => p.id === plantId);
    const plantScans = getPlantScans(plantId);

    const handleScanPress = () => {
        router.push({
            pathname: '/(tabs)/scan',
            params: { plantId: selectedPlant?.id, plantType: selectedPlant?.type },
        });
    };

    if (!selectedPlant) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.pageSubtitle}>Plant not found.</Text>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                        <Text style={styles.backBtn}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const chartLabels = plantScans.slice(-6).map(s => {
        const date = new Date(s.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    // Ensure at least some data for the chart
    const trendData = selectedPlant.healthTrend.length > 0 ? selectedPlant.healthTrend : [100];
    const displayLabels = chartLabels.length > 0 ? chartLabels : ['Start'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'critical': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.detailHeader, { paddingTop: insets.top, backgroundColor: getStatusColor(selectedPlant.status) }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={[styles.backBtn, { color: '#fff' }]}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.detailTop}>
                        <View style={styles.detailIcon}>
                            <Text style={{ fontSize: 32 }}>🌿</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.detailTitle, { color: '#fff' }]}>{selectedPlant.name}</Text>
                            <Text style={[styles.detailMeta, { color: '#f3f4f6' }]}>{selectedPlant.type}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.detailScore, { color: '#fff' }]}>{Math.round(selectedPlant.health)}%</Text>
                            <Text style={[styles.detailLabel, { color: '#f3f4f6' }]}>Health</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Chart data={trendData} labels={displayLabels} />

                    <View style={styles.statsGrid}>
                        <StatCard 
                            icon="calendar" 
                            label="Last Check" 
                            value={new Date(selectedPlant.lastChecked).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                            color='#3b82f6' 
                        />
                        <StatCard icon="clipboard" label="Total Scans" value={selectedPlant.entries.toString()} color='#10b981' />
                        <StatCard 
                            icon="alert-triangle" 
                            label="Current Status" 
                            value={selectedPlant.status.charAt(0).toUpperCase() + selectedPlant.status.slice(1)} 
                            color={getStatusColor(selectedPlant.status)} 
                        />
                    </View>

                    <Timeline scans={plantScans} />

                    <View style={{ marginTop: 16, marginBottom: 100 }}>
                        <TouchableOpacity
                            style={[styles.btnPrimary, { backgroundColor: getStatusColor(selectedPlant.status) }]}
                            onPress={handleScanPress}
                        >
                            <>
                                <Feather name="camera" size={20} color="#fff" />
                                <Text style={styles.btnPrimaryText}>Add New Scan</Text>
                            </>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnSecondary, { marginTop: 24, borderColor: '#ef4444' }]}
                            onPress={() => {
                                Alert.alert(
                                    "Delete Plant",
                                    `Are you sure you want to delete ${selectedPlant.name}? This cannot be undone.`,
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        },
                                        { 
                                            text: "Delete", 
                                            onPress: async () => {
                                                await deletePlant(plantId);
                                                router.replace('/(tabs)/tracking');
                                            },
                                            style: "destructive"
                                        }
                                    ]
                                );
                            }}
                        >
                            <Text style={[styles.btnSecondaryText, { color: '#ef4444' }]}>
                                Delete Plant
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
