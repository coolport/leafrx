import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal, plantTypes } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal';
import { AnalysisResponse, Plant, ScanResult } from '../../components/leafrx/types';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ScanScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams<{ plantId?: string; plantType?: string }>();
    const isUpdatingPlant = !!params.plantId;

    const { plants, addScan, addPlant } = usePlantStore();

    const [isResultsModalVisible, setResultsModalVisible] = useState(false);
    const [isAddPlantModalVisible, setAddPlantModalVisible] = useState(false);
    const [isAssignPlantModalVisible, setAssignPlantModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [selectedPlantClass, setSelectedPlantClass] = useState<string | undefined>(isUpdatingPlant ? params.plantType : undefined);

    const mutation = useMutation({
        mutationFn: ({ uri, type }: { uri: string, type?: string }) => apiService.analyzeImage(uri, type),
        onSuccess: (data) => {
            if (data.success) {
                setAnalysisResult(data);
                setResultsModalVisible(true);
            } else {
                Alert.alert('Analysis Failed', data.error || 'Unknown error occurred');
            }
        },
        onError: () => {
            Alert.alert('Connection Error', 'Failed to connect to the server.');
        }
    });

    const scanLinePos = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        if (mutation.isPending) {
            scanLinePos.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                false
            );
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        } else {
            scanLinePos.value = 0;
            pulseScale.value = 1;
        }
    }, [mutation.isPending]);

    const animatedScanStyle = useAnimatedStyle(() => ({
        top: `${scanLinePos.value * 100}%`,
        opacity: mutation.isPending ? 1 : 0
    }));

    const animatedPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }]
    }));

    useFocusEffect(
        React.useCallback(() => {
            if (!params.plantId) {
                setResultsModalVisible(false);
                setAddPlantModalVisible(false);
                setAssignPlantModalVisible(false);
                setSelectedImageUri(null);
                setAnalysisResult(null);
                setSelectedPlantClass(undefined);
                mutation.reset();
            } else {
                setSelectedPlantClass(params.plantType);
            }
        }, [params.plantId, params.plantType])
    );

    const processImage = async (uri: string) => {
        setSelectedImageUri(uri);
        mutation.mutate({ uri, type: selectedPlantClass });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: true,
            allowsEditing: false,
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
            // allowsEditing: true,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) processImage(result.assets[0].uri);
    };

    const handleSaveAsNewPlant = () => {
        setResultsModalVisible(false);
        setAddPlantModalVisible(true);
    };

    const handleAssignToPlant = () => {
        setResultsModalVisible(false);
        setAssignPlantModalVisible(true);
    };

    const handleUpdatePlant = async () => {
        await saveScanToStore(params.plantId);
        setResultsModalVisible(false);
        router.back();
    };

    const onAddPlantSave = async (name: string, type: string) => {
        if (!analysisResult) return;
        await addPlant({
            name,
            type,
            health: analysisResult.overall_health_score || 0,
            lastChecked: new Date().toISOString(),
            status: analysisResult.status || 'warning',
        });
        const updatedPlants = usePlantStore.getState().plants;
        const newPlant = updatedPlants[0];
        if (newPlant) {
            await saveScanToStore(newPlant.id);
            setAddPlantModalVisible(false);
            router.push(`/plant/${newPlant.id}`);
        }
    };

    const onSelectExistingPlant = async (plant: Plant) => {
        await saveScanToStore(plant.id);
        setAssignPlantModalVisible(false);
        router.push(`/plant/${plant.id}`);
    };

    const saveScanToStore = async (plantIdToSave?: string) => {
        if (!analysisResult) return;
        const plantInfo = usePlantStore.getState().plants.find(p => p.id === plantIdToSave);
        const [_, disease] = analysisResult.primary_disease?.split('_') || ['Unknown', 'Unknown'];
        const scanRecord: ScanResult = {
            id: analysisResult.image_id || Math.random().toString(),
            plantId: plantIdToSave,
            plantName: plantInfo?.name || 'Unassigned',
            disease: disease || 'Unknown',
            severity: analysisResult.predictions?.[0]?.severity || 'Unknown',
            date: new Date().toISOString(),
            healthScore: analysisResult.overall_health_score || 0,
            predictions: analysisResult.predictions || [],
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

    const detectedPlantType = analysisResult?.primary_disease?.split('_')[0];
    const filterType = selectedPlantClass || detectedPlantType;
    const filteredPlantsForAssignment = filterType
        ? plants.filter(p => p.type.toLowerCase() === filterType.toLowerCase())
        : plants;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                style={styles.screen}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                {/* ── Header ── */}
                <LinearGradient
                    colors={['#059669', '#10b981', '#34d399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 32, marginBottom: 24 }]}
                >
                    <View style={[styles.headerTop, { marginBottom: 0 }]}>
                        <View>
                            <Text style={styles.headerTitle}>
                                {isUpdatingPlant ? 'New Scan' : 'Leaf Diagnosis'}
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                {isUpdatingPlant
                                    ? `For: ${plants.find(p => p.id === params.plantId)?.name}`
                                    : 'AI-powered disease detection'}
                            </Text>
                        </View>
                        {/* Status pill */}
                        <View style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.3)',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' }} />
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                                {mutation.isPending ? 'SCANNING' : 'READY'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -20 }]}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 24,
                        padding: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>

                        {/* ── Plant Type Selector ── */}
                        {!isUpdatingPlant && (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.label}>Plant Type</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 10, paddingRight: 8 }}
                                    style={styles.chipsScroll}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={!selectedPlantClass ? styles.chipSelected : styles.chip}
                                        onPress={() => setSelectedPlantClass(undefined)}
                                    >
                                        <Text style={!selectedPlantClass ? styles.chipTextSelected : styles.chipText}>
                                            ✦ Auto
                                        </Text>
                                    </TouchableOpacity>
                                    {plantTypes.map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            activeOpacity={0.7}
                                            style={selectedPlantClass === type ? styles.chipSelected : styles.chip}
                                            onPress={() => setSelectedPlantClass(type)}
                                        >
                                            <Text style={selectedPlantClass === type ? styles.chipTextSelected : styles.chipText}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* ── Viewfinder ── */}
                        <Animated.View style={[styles.cameraArea, animatedPulseStyle, {
                            borderWidth: mutation.isPending ? 2 : 1,
                            borderColor: mutation.isPending ? '#10b981' : '#f1f5f9',
                        }]}>
                            {selectedImageUri ? (
                                <View style={{ width: '100%', height: '100%' }}>
                                    <Image
                                        source={{ uri: selectedImageUri }}
                                        style={[{ width: '100%', height: '100%' }, mutation.isPending && { opacity: 0.55 }]}
                                    />
                                    {mutation.isPending && (
                                        <>
                                            {/* Scan line */}
                                            <Animated.View style={[styles.scanningLine, animatedScanStyle]} />
                                            {/* Corner brackets */}
                                            <View style={[StyleSheet.absoluteFill, { margin: 16 }]}>
                                                {/* TL */}
                                                <View style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#10b981', borderTopLeftRadius: 6 }} />
                                                {/* TR */}
                                                <View style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#10b981', borderTopRightRadius: 6 }} />
                                                {/* BL */}
                                                <View style={{ position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#10b981', borderBottomLeftRadius: 6 }} />
                                                {/* BR */}
                                                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#10b981', borderBottomRightRadius: 6 }} />
                                            </View>
                                            {/* Center overlay */}
                                            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                                                <View style={{
                                                    backgroundColor: 'rgba(0,0,0,0.55)',
                                                    borderRadius: 20,
                                                    paddingHorizontal: 24,
                                                    paddingVertical: 16,
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}>
                                                    <ActivityIndicator size="large" color="#10b981" />
                                                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 1 }}>
                                                        ANALYZING...
                                                    </Text>
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </View>
                            ) : (
                                /* Empty state */
                                <View style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', gap: 0 }}>
                                    <View style={styles.scannerFrame} />
                                    {/* Icon bubble */}
                                    <View style={{
                                        width: 76,
                                        height: 76,
                                        backgroundColor: '#ecfdf5',
                                        borderRadius: 24,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 16,
                                        borderWidth: 1,
                                        borderColor: '#d1fae5',
                                    }}>
                                        <Feather name="camera" size={34} color="#10b981" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                                        Scanner
                                    </Text>
                                    <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: '500' }}>
                                        Ensure good lighting &amp; focus
                                    </Text>
                                </View>
                            )}
                        </Animated.View>

                        {/* ── Image source label ── */}
                        {selectedImageUri && !mutation.isPending && (
                            <TouchableOpacity
                                onPress={() => setSelectedImageUri(null)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 12,
                                    gap: 6,
                                }}
                            >
                                <Feather name="refresh-ccw" size={13} color="#94a3b8" />
                                <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '600' }}>Tap to clear & rescan</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ── Action Buttons ── */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                        {/* Take Photo — primary */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={takePhoto}
                            disabled={mutation.isPending}
                            style={{ flex: 1.5, opacity: mutation.isPending ? 0.55 : 1 }}
                        >
                            <LinearGradient
                                colors={['#059669', '#10b981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.btnPrimary, { height: 60, borderRadius: 20 }]}
                            >
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    padding: 6,
                                    borderRadius: 10,
                                }}>
                                    <Feather name="camera" size={18} color="#fff" />
                                </View>
                                <Text style={styles.btnPrimaryText}>Take Photo</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Gallery — secondary */}
                        <TouchableOpacity
                            style={[styles.btnSecondary, { flex: 1, height: 60, borderRadius: 20, opacity: mutation.isPending ? 0.55 : 1 }]}
                            onPress={pickImage}
                            disabled={mutation.isPending}
                            activeOpacity={0.7}
                        >
                            <View style={{
                                backgroundColor: '#f1f5f9',
                                padding: 6,
                                borderRadius: 10,
                            }}>
                                <Feather name="image" size={16} color="#64748b" />
                            </View>
                            <Text style={styles.btnSecondaryText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── How it works ── */}
                    {!selectedImageUri && (
                        <View style={{
                            marginTop: 24,
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}>
                            <Text style={[styles.label, { marginBottom: 16 }]}>How It Works</Text>
                            {[
                                { icon: 'camera', step: '01', title: 'Capture', desc: 'Take or upload a clear photo of the affected leaf' },
                                { icon: 'cpu', step: '02', title: 'Analyze', desc: 'AI model scans for diseases, pests & deficiencies' },
                                { icon: 'clipboard', step: '03', title: 'Results', desc: 'Get instant diagnosis with treatment recommendations' },
                            ].map((item, i) => (
                                <View key={item.step} style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    gap: 14,
                                    marginBottom: i < 2 ? 16 : 0,
                                }}>
                                    {/* Step number + icon */}
                                    <View style={{ alignItems: 'center', gap: 4 }}>
                                        <View style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 14,
                                            backgroundColor: '#ecfdf5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#d1fae5',
                                        }}>
                                            <Feather name={item.icon as any} size={18} color="#10b981" />
                                        </View>
                                        {i < 2 && (
                                            <View style={{ width: 2, height: 16, backgroundColor: '#e2e8f0', borderRadius: 1 }} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1, paddingTop: 4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#10b981', letterSpacing: 1 }}>
                                                {item.step}
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>{item.title}</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 18, fontWeight: '500' }}>{item.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ── Results Modal ── */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isResultsModalVisible}
                onRequestClose={() => setResultsModalVisible(false)}
            >
                <BlurView intensity={30} style={styles.modalContainer}>
                    <View style={styles.bottomSheetContent}>
                        <View style={styles.bottomSheetHandle} />

                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 24,
                            paddingBottom: 16,
                        }}>
                            <View>
                                <Text style={styles.modalTitle}>Diagnosis Results</Text>
                                <Text style={{ fontSize: 13, color: '#94a3b8', fontWeight: '500', marginTop: 2 }}>
                                    AI-powered analysis
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                    <Feather name="x" size={20} color="#64748b" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                        >
                            {/* Scanned image */}
                            {selectedImageUri && (
                                <View style={{ marginBottom: 20 }}>
                                    <Image
                                        source={{ uri: selectedImageUri }}
                                        style={{ width: '100%', height: 220, borderRadius: 24 }}
                                        resizeMode="cover"
                                    />
                                    {/* Health score badge over image */}
                                    {analysisResult && (
                                        <View style={{
                                            position: 'absolute',
                                            bottom: 12,
                                            right: 12,
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            borderRadius: 16,
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor(analysisResult?.status) }} />
                                            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
                                                {analysisResult?.overall_health_score}% Health
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {analysisResult && (
                                <>
                                    {/* Primary finding card */}
                                    <View style={{
                                        backgroundColor: getStatusColor(analysisResult?.status) + '12',
                                        borderRadius: 24,
                                        padding: 20,
                                        marginBottom: 16,
                                        borderWidth: 1,
                                        borderColor: getStatusColor(analysisResult?.status) + '30',
                                    }}>
                                        <Text style={{ fontSize: 11, fontWeight: '800', color: getStatusColor(analysisResult?.status), letterSpacing: 1.5, marginBottom: 6 }}>
                                            PRIMARY FINDING
                                        </Text>
                                        <Text style={{ fontSize: 26, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5, marginBottom: 10 }}>
                                            {analysisResult?.primary_disease?.split('_')[1]?.toUpperCase() || 'HEALTHY'}
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            {/* Plant type tag */}
                                            <View style={{
                                                backgroundColor: '#fff',
                                                paddingHorizontal: 10,
                                                paddingVertical: 4,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: '#e2e8f0',
                                            }}>
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>
                                                    {analysisResult?.primary_disease?.split('_')[0]?.toUpperCase()}
                                                </Text>
                                            </View>
                                            {/* Confidence */}
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 4,
                                            }}>
                                                <Feather name="zap" size={12} color="#f59e0b" />
                                                <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600' }}>
                                                    {Math.round((analysisResult?.predictions?.[0]?.disease_confidence || 0) * 100)}% confidence
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Recommendations */}
                                    {analysisResult?.predictions?.[0]?.recommendations && (
                                        <View style={{ marginBottom: 8 }}>
                                            <Text style={styles.label}>Recommendations</Text>
                                            {analysisResult.predictions[0].recommendations.map((rec, i) => (
                                                <View
                                                    key={i}
                                                    style={{
                                                        flexDirection: 'row',
                                                        marginBottom: 10,
                                                        gap: 12,
                                                        alignItems: 'flex-start',
                                                        backgroundColor: '#f8fafc',
                                                        borderRadius: 14,
                                                        padding: 12,
                                                        borderWidth: 1,
                                                        borderColor: '#f1f5f9',
                                                    }}
                                                >
                                                    <View style={{ backgroundColor: '#dcfce7', padding: 6, borderRadius: 10, marginTop: 1 }}>
                                                        <Feather name="check" size={13} color="#10b981" />
                                                    </View>
                                                    <Text style={{ flex: 1, fontSize: 14, color: '#475569', fontWeight: '500', lineHeight: 20 }}>
                                                        {rec}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        {/* CTA buttons */}
                        <View style={{
                            paddingHorizontal: 24,
                            paddingTop: 12,
                            paddingBottom: 40,
                            flexDirection: 'row',
                            gap: 12,
                            borderTopWidth: 1,
                            borderTopColor: '#f1f5f9',
                        }}>
                            {isUpdatingPlant ? (
                                <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleUpdatePlant}>
                                    <LinearGradient
                                        colors={['#059669', '#10b981']}
                                        style={[styles.modalButton, { marginHorizontal: 0 }]}
                                    >
                                        <Text style={styles.modalButtonText}>Update Plant Info</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleAssignToPlant}>
                                        <View style={[styles.modalButton, {
                                            backgroundColor: '#f1f5f9',
                                            marginHorizontal: 0,
                                            borderWidth: 1,
                                            borderColor: '#e2e8f0',
                                        }]}>
                                            <Text style={[styles.modalButtonText, { color: '#475569' }]}>Assign Existing</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={handleSaveAsNewPlant}>
                                        <LinearGradient
                                            colors={['#059669', '#10b981']}
                                            style={[styles.modalButton, { marginHorizontal: 0 }]}
                                        >
                                            <Text style={styles.modalButtonText}>Save as New</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </BlurView>
            </Modal>

            <AddPlantModal
                isVisible={isAddPlantModalVisible}
                onClose={() => setAddPlantModalVisible(false)}
                onSave={onAddPlantSave}
                initialPlantType={selectedPlantClass}
            />

            <AssignPlantModal
                isVisible={isAssignPlantModalVisible}
                onClose={() => setAssignPlantModalVisible(false)}
                plants={filteredPlantsForAssignment}
                onSelectPlant={onSelectExistingPlant}
            />
        </View>
    );
}
