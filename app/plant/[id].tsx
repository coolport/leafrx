import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Alert, Image, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../../constants/styles';
import { Chart } from '../../components/leafrx/Chart';
import { StatCard } from '../../components/leafrx/StatCard';
import { Timeline } from '../../components/leafrx/Timeline';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { AnalysisResponse, ScanResult } from '../../components/leafrx/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const plantId = Array.isArray(id) ? id[0] : id;

    const { plants, getPlantScans, deletePlant, addScan } = usePlantStore();
    const selectedPlant = plants.find(p => p.id === plantId);
    const plantScans = getPlantScans(plantId);

    const [isResultsModalVisible, setResultsModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

    const mutation = useMutation({
        mutationFn: ({ uri, type }: { uri: string, type?: string }) => apiService.analyzeImage(uri, type),
        onSuccess: (data) => {
            if (data.success) {
                setAnalysisResult(data);
                setResultsModalVisible(true);
                saveScanToStore(data);
            } else {
                Alert.alert('Analysis Failed', data.error || 'Unknown error occurred');
            }
        },
        onError: () => {
            Alert.alert('Connection Error', 'Failed to connect to the server.');
        }
    });

    const processImage = async (uri: string) => {
        setSelectedImageUri(uri);
        mutation.mutate({ uri, type: selectedPlant?.type });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) processImage(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required.');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) processImage(result.assets[0].uri);
    };

    const saveScanToStore = async (result: AnalysisResponse) => {
        if (!selectedPlant) return;
        const [_, disease] = result.primary_disease?.split('_') || ['Unknown', 'Unknown'];
        const scanRecord: ScanResult = {
            id: result.image_id || Math.random().toString(),
            plantId: selectedPlant.id,
            plantName: selectedPlant.name,
            disease: disease || 'Unknown',
            severity: result.predictions?.[0]?.severity || 'Unknown',
            date: new Date().toISOString(),
            healthScore: result.overall_health_score || 0,
            predictions: result.predictions || [],
        };
        await addScan(scanRecord);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'healthy': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'critical': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusColors = (status: string): [string, string, string] => {
        switch (status) {
            case 'healthy': return ['#059669', '#10b981', '#34d399'];
            case 'warning': return ['#d97706', '#f59e0b', '#fbbf24'];
            case 'critical': return ['#dc2626', '#ef4444', '#f87171'];
            default: return ['#475569', '#64748b', '#94a3b8'];
        }
    };

    if (!selectedPlant) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <View style={{ backgroundColor: '#f1f5f9', padding: 24, borderRadius: 32, marginBottom: 20 }}>
                    <Feather name="alert-circle" size={40} color="#94a3b8" />
                </View>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>Plant not found</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>This plant may have been deleted.</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
                >
                    <Text style={{ color: '#475569', fontWeight: '700' }}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusColors = getStatusColors(selectedPlant.status);
    const trendData = selectedPlant.healthTrend.length > 0 ? selectedPlant.healthTrend : [100];
    const chartLabels = plantScans.slice(-6).map(s => {
        const date = new Date(s.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const displayLabels = chartLabels.length > 0 ? chartLabels : ['Start'];

    const healthScore = Math.round(selectedPlant.health);
    const lastCheckedFormatted = new Date(selectedPlant.lastChecked).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                style={styles.screen}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {/* Hero Header */}
                <LinearGradient
                    colors={statusColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 12, paddingBottom: 48, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }]}
                >
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            marginLeft: 20,
                            marginBottom: 20,
                            width: 38, height: 38,
                            borderRadius: 19,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Feather name="chevron-left" size={22} color="#fff" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInDown.duration(700)} style={{ paddingHorizontal: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            {/* Plant emoji badge */}
                            <View style={{
                                width: 72, height: 72,
                                borderRadius: 24,
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                borderWidth: 1.5,
                                borderColor: 'rgba(255,255,255,0.35)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{ fontSize: 38 }}>{getPlantEmoji(selectedPlant.type)}</Text>
                            </View>

                            {/* Name + type */}
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.detailTitle, { marginBottom: 6 }]}>{selectedPlant.name}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.22)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 10,
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 }}>
                                            {selectedPlant.type.toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.22)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4
                                    }}>
                                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' }} />
                                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                            {selectedPlant.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Health score */}
                            <View style={{ alignItems: 'center' }}>
                                {mutation.isPending ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Text style={{ fontSize: 34, fontWeight: '900', color: '#fff', lineHeight: 38 }}>{healthScore}</Text>
                                        <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>HEALTH</Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </Animated.View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -24 }]}>

                    {/* Quick stats row */}
                    <Animated.View
                        entering={FadeInUp.delay(150).duration(600)}
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 16,
                        }}
                    >
                        {[
                            { icon: 'calendar', label: 'Last Check', value: lastCheckedFormatted, color: '#3b82f6' },
                            { icon: 'clipboard', label: 'Total Scans', value: selectedPlant.entries.toString(), color: '#10b981' },
                            { icon: 'activity', label: 'Status', value: selectedPlant.status.toUpperCase(), color: statusColors[1] },
                        ].map((stat, i) => (
                            <Animated.View key={stat.label} entering={FadeInRight.delay(200 + i * 80).duration(500)} style={{ flex: 1 }}>
                                <StatCard
                                    icon={stat.icon as any}
                                    label={stat.label}
                                    value={stat.value}
                                    color={stat.color}
                                />
                            </Animated.View>
                        ))}
                    </Animated.View>

                    {/* Chart */}
                    <Animated.View entering={FadeInDown.delay(350).duration(700)}>
                        <Chart data={trendData} labels={displayLabels} color={statusColors[1]} />
                    </Animated.View>

                    {/* Timeline */}
                    <Animated.View entering={FadeInDown.delay(500).duration(700)}>
                        <Timeline scans={plantScans} />
                    </Animated.View>

                    {/* Actions */}
                    <Animated.View entering={FadeInUp.delay(650).duration(700)}>
                        <Text style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: '#94a3b8',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            marginBottom: 12,
                            marginTop: 8
                        }}>
                            Actions
                        </Text>

                        {/* Primary scan button */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={takePhoto}
                            disabled={mutation.isPending}
                            style={{ marginBottom: 10 }}
                        >
                            <LinearGradient
                                colors={[statusColors[0], statusColors[1]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 60,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    shadowColor: statusColors[0],
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                    elevation: 6,
                                }}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <ActivityIndicator color="#fff" size="small" />
                                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Analyzing...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Feather name="camera" size={20} color="#fff" />
                                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 }}>Scan Leaf</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Secondary actions */}
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={pickImage}
                                disabled={mutation.isPending}
                                style={{
                                    flex: 1,
                                    height: 52,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    borderWidth: 1,
                                    borderColor: '#e2e8f0',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.04,
                                    shadowRadius: 6,
                                    elevation: 2,
                                }}
                            >
                                <Feather name="image" size={16} color="#64748b" />
                                <Text style={{ color: '#64748b', fontWeight: '700', fontSize: 13 }}>Upload</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    Alert.alert(
                                        "Delete Plant",
                                        `Remove "${selectedPlant.name}" permanently?`,
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
                                style={{
                                    flex: 1,
                                    height: 52,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    borderWidth: 1,
                                    borderColor: '#fecaca',
                                    shadowColor: '#ef4444',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.06,
                                    shadowRadius: 6,
                                    elevation: 2,
                                }}
                            >
                                <Feather name="trash-2" size={16} color="#ef4444" />
                                <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 13 }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>

            {/* Results Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isResultsModalVisible}
                onRequestClose={() => setResultsModalVisible(false)}
            >
                <BlurView intensity={30} style={styles.modalContainer}>
                    <View style={[styles.bottomSheetContent, { maxHeight: SCREEN_HEIGHT * 0.88 }]}>
                        <View style={styles.bottomSheetHandle} />

                        {/* Modal header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b' }}>Diagnosis Results</Text>
                                <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 2 }}>Saved to {selectedPlant.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                    <Feather name="x" size={18} color="#64748b" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                            {/* Image with status badge */}
                            {selectedImageUri && (
                                <View style={{ marginBottom: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
                                    <Image
                                        source={{ uri: selectedImageUri }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                    <View style={{
                                        position: 'absolute',
                                        top: 12, right: 12,
                                        backgroundColor: getStatusColor(analysisResult?.status),
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5
                                    }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
                                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {analysisResult?.status}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Primary finding */}
                            <View style={{
                                backgroundColor: getStatusColor(analysisResult?.status) + '12',
                                borderRadius: 20,
                                padding: 18,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: getStatusColor(analysisResult?.status) + '30',
                            }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
                                    Primary Finding
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, marginRight: 16 }}>
                                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 6 }}>
                                            {analysisResult?.primary_disease?.split('_')[1]?.replace(/([A-Z])/g, ' $1').trim() || 'Healthy'}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                    {analysisResult?.primary_disease?.split('_')[0]}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '600' }}>
                                                {Math.round((analysisResult?.predictions?.[0]?.disease_confidence || 0) * 100)}% confidence
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Health circle */}
                                    <View style={{
                                        width: 68, height: 68,
                                        borderRadius: 34,
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        borderColor: getStatusColor(analysisResult?.status),
                                        shadowColor: getStatusColor(analysisResult?.status),
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 8,
                                        elevation: 4,
                                    }}>
                                        <Text style={{ fontSize: 20, fontWeight: '900', color: getStatusColor(analysisResult?.status) }}>
                                            {analysisResult?.overall_health_score}
                                        </Text>
                                        <Text style={{ fontSize: 8, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 }}>HEALTH</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Recommendations */}
                            {analysisResult?.predictions?.[0]?.recommendations && (
                                <View>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
                                        Recommendations
                                    </Text>
                                    <View style={{ gap: 8 }}>
                                        {analysisResult.predictions[0].recommendations.map((rec, i) => (
                                            <View key={i} style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                backgroundColor: '#f8fafc',
                                                borderRadius: 14,
                                                padding: 12,
                                                gap: 10,
                                                borderWidth: 1,
                                                borderColor: '#f1f5f9'
                                            }}>
                                                <View style={{ backgroundColor: '#dcfce7', padding: 5, borderRadius: 8, marginTop: 1 }}>
                                                    <Feather name="check" size={12} color="#10b981" />
                                                </View>
                                                <Text style={{ flex: 1, fontSize: 13, color: '#475569', fontWeight: '500', lineHeight: 19 }}>{rec}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 8 }}>
                            <TouchableOpacity activeOpacity={0.85} onPress={() => setResultsModalVisible(false)}>
                                <LinearGradient
                                    colors={[statusColors[0], statusColors[1]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.modalButton, { marginHorizontal: 0 }]}
                                >
                                    <Text style={styles.modalButtonText}>Done</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
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
