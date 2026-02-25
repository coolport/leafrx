import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
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

    const handleBack = () => {
        router.back();
    };

    if (!selectedPlant) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                    <Feather name="alert-circle" size={48} color="#94a3b8" />
                    <Text style={[styles.pageSubtitle, { marginTop: 16, textAlign: 'center' }]}>Plant information not found.</Text>
                    <TouchableOpacity onPress={handleBack} style={{ marginTop: 24 }}>
                        <Text style={[styles.viewAll, { fontSize: 16 }]}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const chartLabels = plantScans.slice(-6).map(s => {
        const date = new Date(s.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const trendData = selectedPlant.healthTrend.length > 0 ? selectedPlant.healthTrend : [100];
    const displayLabels = chartLabels.length > 0 ? chartLabels : ['Start'];

    const getStatusColors = (status: string): [string, string, string] => {
        switch (status) {
            case 'healthy': return ['#059669', '#10b981', '#34d399'];
            case 'warning': return ['#d97706', '#f59e0b', '#fbbf24'];
            case 'critical': return ['#dc2626', '#ef4444', '#f87171'];
            default: return ['#475569', '#64748b', '#94a3b8'];
        }
    };

    const statusColors = getStatusColors(selectedPlant.status);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView 
                style={styles.screen} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                <LinearGradient
                    colors={statusColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }]}
                >
                    <TouchableOpacity 
                        onPress={handleBack} 
                        style={{ marginLeft: 24, marginBottom: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Feather name="chevron-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInDown.duration(800)} style={[styles.detailTop, { paddingHorizontal: 24, marginBottom: 12 }]}>
                        <View style={[styles.detailIcon, { backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
                            <Text style={{ fontSize: 36 }}>{getPlantEmoji(selectedPlant.type)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }}>
                                <Text style={[styles.detailMeta, { color: '#fff', fontWeight: '700' }]}>{selectedPlant.type.toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.detailScore}>{Math.round(selectedPlant.health)}%</Text>
                            <Text style={[styles.detailLabel, { fontWeight: '700' }]}>HEALTH</Text>
                        </View>
                    </Animated.View>
                </LinearGradient>

                <View style={styles.section}>
                    <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                        <Chart data={trendData} labels={displayLabels} color={statusColors[1]} />
                    </Animated.View>

                    <View style={[styles.statsGrid, { marginTop: 8 }]}>
                        <Animated.View entering={FadeInRight.delay(400).duration(600)} style={{ flex: 1 }}>
                            <StatCard 
                                icon="calendar" 
                                label="Last Check" 
                                value={new Date(selectedPlant.lastChecked).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                                color='#3b82f6' 
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(500).duration(600)} style={{ flex: 1 }}>
                            <StatCard icon="clipboard" label="Scans" value={selectedPlant.entries.toString()} color='#10b981' />
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(600).duration(600)} style={{ flex: 1 }}>
                            <StatCard 
                                icon="alert-triangle" 
                                label="Status" 
                                value={selectedPlant.status.toUpperCase()} 
                                color={statusColors[1]} 
                            />
                        </Animated.View>
                    </View>

                    <Animated.View entering={FadeInDown.delay(700).duration(800)}>
                        <Timeline scans={plantScans} />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(900).duration(800)} style={{ marginTop: 32 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleScanPress}
                        >
                            <LinearGradient
                                colors={statusColors.slice(0, 2)}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.btnPrimary}
                            >
                                <Feather name="camera" size={20} color="#fff" />
                                <Text style={styles.btnPrimaryText}>Perform New Analysis</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={[styles.btnSecondary, { marginTop: 16, borderColor: '#fee2e2', backgroundColor: '#fff' }]}
                            onPress={() => {
                                Alert.alert(
                                    "Delete Plant",
                                    `Are you sure you want to delete ${selectedPlant.name}? This action is permanent.`,
                                    [
                                        { text: "Cancel", style: "cancel" },
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
                            <Text style={[styles.btnSecondaryText, { color: '#ef4444', fontWeight: '700' }]}>
                                Remove from Tracker
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

function getPlantEmoji(type: string) {
    const t = type.toLowerCase();
    if (t.includes('mango')) return '🥭';
    if (t.includes('banana')) return '🍌';
    if (t.includes('guava')) return '🍈';
    if (t.includes('calamansi')) return '🍊';
    return '🌿';
}
