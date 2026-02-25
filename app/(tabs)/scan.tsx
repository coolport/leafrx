import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal, plantTypes } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal';
import { AnalysisResponse, Plant, ScanResult } from '../../components/leafrx/types';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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

    useEffect(() => {
        if (mutation.isPending) {
            scanLinePos.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                false
            );
        } else {
            scanLinePos.value = 0;
        }
    }, [mutation.isPending]);

    const animatedScanStyle = useAnimatedStyle(() => ({
        top: `${scanLinePos.value * 100}%`,
        opacity: mutation.isPending ? 1 : 0
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

    const targetPlantName = plants.find(p => p.id === params.plantId)?.name;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                style={styles.screen}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#059669', '#10b981', '#34d399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 40 }]}
                >
                    <Animated.View entering={FadeInDown.duration(800)} style={{ paddingHorizontal: 24 }}>
                        {isUpdatingPlant && (
                            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                                    <Feather name="arrow-left" size={14} color="#fff" />
                                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Back</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.headerTitle}>
                            {isUpdatingPlant ? "New Scan" : "Leaf Diagnosis"}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {isUpdatingPlant
                                ? `Scanning for: ${targetPlantName}`
                                : "Identify plant diseases instantly with AI"}
                        </Text>
                    </Animated.View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -28 }]}>

                    {/* Species Selector */}
                    {!isUpdatingPlant && (
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(700)}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 24,
                                padding: 16,
                                marginBottom: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 10,
                                elevation: 3,
                            }}
                        >
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>
                                Target Species
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8 }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setSelectedPlantClass(undefined)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: !selectedPlantClass ? '#059669' : '#f1f5f9',
                                        borderWidth: !selectedPlantClass ? 0 : 1,
                                        borderColor: '#e2e8f0',
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '700',
                                        color: !selectedPlantClass ? '#fff' : '#64748b'
                                    }}>Auto-detect</Text>
                                </TouchableOpacity>
                                {plantTypes.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedPlantClass(type)}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor: selectedPlantClass === type ? '#059669' : '#f1f5f9',
                                            borderWidth: selectedPlantClass === type ? 0 : 1,
                                            borderColor: '#e2e8f0',
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: selectedPlantClass === type ? '#fff' : '#64748b'
                                        }}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    )}

                    {/* Viewfinder */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800)}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 28,
                            overflow: 'hidden',
                            shadowColor: '#059669',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.12,
                            shadowRadius: 20,
                            elevation: 6,
                            marginBottom: 16,
                        }}
                    >
                        <View style={{
                            height: 300,
                            backgroundColor: '#0f1f17',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            {selectedImageUri && !mutation.isPending ? (
                                <Image
                                    source={{ uri: selectedImageUri }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            ) : mutation.isPending ? (
                                // Analyzing state
                                <View style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                                    {selectedImageUri && (
                                        <Image
                                            source={{ uri: selectedImageUri }}
                                            style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.4 }}
                                            resizeMode="cover"
                                        />
                                    )}
                                    <Animated.View style={[styles.scanningLine, animatedScanStyle]} />
                                    <View style={{ alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24, borderRadius: 20 }}>
                                        <ActivityIndicator size="large" color="#34d399" />
                                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15, marginTop: 12 }}>Analyzing Leaf...</Text>
                                        <Text style={{ color: '#86efac', fontSize: 12, fontWeight: '500', marginTop: 4 }}>Examining texture & health markers</Text>
                                    </View>
                                </View>
                            ) : (
                                // Empty state
                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
                                    {/* Corner brackets */}
                                    {[
                                        { top: 32, left: 32 },
                                        { top: 32, right: 32 },
                                        { bottom: 32, left: 32 },
                                        { bottom: 32, right: 32 },
                                    ].map((pos, i) => (
                                        <View key={i} style={{
                                            position: 'absolute',
                                            width: 28, height: 28,
                                            borderColor: '#34d399',
                                            borderTopWidth: pos.bottom !== undefined ? 0 : 2.5,
                                            borderBottomWidth: pos.top !== undefined ? 0 : 2.5,
                                            borderLeftWidth: pos.right !== undefined ? 0 : 2.5,
                                            borderRightWidth: pos.left !== undefined ? 0 : 2.5,
                                            borderTopLeftRadius: pos.top !== undefined && pos.left !== undefined ? 6 : 0,
                                            borderTopRightRadius: pos.top !== undefined && pos.right !== undefined ? 6 : 0,
                                            borderBottomLeftRadius: pos.bottom !== undefined && pos.left !== undefined ? 6 : 0,
                                            borderBottomRightRadius: pos.bottom !== undefined && pos.right !== undefined ? 6 : 0,
                                            ...pos
                                        }} />
                                    ))}
                                    <View style={{
                                        width: 64, height: 64,
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(52, 211, 153, 0.15)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: 'rgba(52, 211, 153, 0.3)'
                                    }}>
                                        <Feather name="aperture" size={30} color="#34d399" />
                                    </View>
                                    <View style={{ alignItems: 'center', gap: 4 }}>
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Position leaf in frame</Text>
                                        <Text style={{ color: '#6ee7b7', fontSize: 12, fontWeight: '500' }}>Good light · Steady focus · Close-up</Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Action buttons inside card */}
                        <View style={{ flexDirection: 'row', padding: 12, gap: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={takePhoto}
                                disabled={mutation.isPending}
                                style={{ flex: 1 }}
                            >
                                <LinearGradient
                                    colors={mutation.isPending ? ['#a7f3d0', '#6ee7b7'] : ['#059669', '#10b981']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        height: 52,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        gap: 8,
                                    }}
                                >
                                    <Feather name="camera" size={18} color="#fff" />
                                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 }}>Take Photo</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={pickImage}
                                disabled={mutation.isPending}
                                style={{
                                    width: 52,
                                    height: 52,
                                    backgroundColor: '#f8fafc',
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#e2e8f0',
                                }}
                            >
                                <Feather name="image" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Tip card */}
                    {!mutation.isPending && !selectedImageUri && (
                        <Animated.View
                            entering={FadeInUp.delay(400).duration(600)}
                            style={{
                                backgroundColor: '#ecfdf5',
                                borderRadius: 18,
                                padding: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                borderWidth: 1,
                                borderColor: '#a7f3d0'
                            }}
                        >
                            <View style={{
                                width: 36, height: 36,
                                borderRadius: 10,
                                backgroundColor: '#d1fae5',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Feather name="info" size={16} color="#059669" />
                            </View>
                            <Text style={{ flex: 1, fontSize: 13, color: '#065f46', fontWeight: '500', lineHeight: 18 }}>
                                For best results, photograph a single leaf with visible symptoms in natural daylight.
                            </Text>
                        </Animated.View>
                    )}
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
                    <View style={[styles.bottomSheetContent, { maxHeight: SCREEN_HEIGHT * 0.9 }]}>
                        <View style={styles.bottomSheetHandle} />

                        {/* Modal Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b' }}>Diagnosis Results</Text>
                                <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 2 }}>AI-powered analysis complete</Text>
                            </View>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                    <Feather name="x" size={18} color="#64748b" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}>
                            {/* Image preview — smaller & rounded */}
                            {selectedImageUri && (
                                <View style={{ marginBottom: 16, borderRadius: 20, overflow: 'hidden', height: 180 }}>
                                    <Image
                                        source={{ uri: selectedImageUri }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                    {/* Status badge over image */}
                                    <View style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        backgroundColor: getStatusColor(analysisResult?.status),
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
                                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {analysisResult?.status || 'Unknown'}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Primary finding card */}
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

                                    {/* Health score circle */}
                                    <View style={{
                                        width: 72, height: 72,
                                        borderRadius: 36,
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        borderColor: getStatusColor(analysisResult?.status),
                                        shadowColor: getStatusColor(analysisResult?.status),
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 8,
                                        elevation: 4
                                    }}>
                                        <Text style={{ fontSize: 22, fontWeight: '900', color: getStatusColor(analysisResult?.status) }}>
                                            {analysisResult?.overall_health_score}
                                        </Text>
                                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 }}>HEALTH</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Recommendations */}
                            {analysisResult?.predictions?.[0]?.recommendations && (
                                <View style={{ marginBottom: 8 }}>
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

                        {/* Action buttons */}
                        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 8, gap: 10 }}>
                            {isUpdatingPlant ? (
                                <TouchableOpacity activeOpacity={0.8} onPress={handleUpdatePlant}>
                                    <LinearGradient
                                        colors={['#059669', '#10b981']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.modalButton, { marginHorizontal: 0 }]}
                                    >
                                        <Text style={styles.modalButtonText}>Update Plant Info</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{ flex: 1 }}
                                        onPress={handleAssignToPlant}
                                    >
                                        <View style={[styles.modalButton, { backgroundColor: '#f1f5f9', marginHorizontal: 0, borderWidth: 1, borderColor: '#e2e8f0' }]}>
                                            <Text style={[styles.modalButtonText, { color: '#475569' }]}>Assign to Plant</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{ flex: 1 }}
                                        onPress={handleSaveAsNewPlant}
                                    >
                                        <LinearGradient
                                            colors={['#059669', '#10b981']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[styles.modalButton, { marginHorizontal: 0 }]}
                                        >
                                            <Text style={styles.modalButtonText}>Save as New</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
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
