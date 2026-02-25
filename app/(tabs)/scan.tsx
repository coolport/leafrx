import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal, plantTypes } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal';
import { AnalysisResponse, Plant, ScanResult } from '../../components/leafrx/types';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

    // Animation values
    const scanLinePos = useSharedValue(0);

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
        
        // We need to add the plant first, then the scan linked to it.
        // addPlant in our store doesn't return the ID, so we use a unique property or refine the store.
        await addPlant({
            name,
            type,
            health: analysisResult.overall_health_score || 0,
            lastChecked: new Date().toISOString(),
            status: analysisResult.status || 'warning',
        });
        
        // Let's get the latest plant (the one we just added)
        const updatedPlants = usePlantStore.getState().plants;
        const newPlant = updatedPlants[0]; // addPlant unshifts to the beginning
        
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
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <LinearGradient
                    colors={['#059669', '#10b981', '#34d399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 32 }]}
                >
                    <Animated.View entering={FadeInDown.duration(800)} style={{ paddingHorizontal: 24 }}>
                        <Text style={styles.headerTitle}>{isUpdatingPlant ? "Add New Scan" : "Leaf Diagnosis"}</Text>
                        <Text style={styles.headerSubtitle}>
                            {isUpdatingPlant ? `For: ${plants.find(p => p.id === params.plantId)?.name}` : "Identify diseases instantly with AI"}
                        </Text>
                    </Animated.View>
                </LinearGradient>

                <Animated.View 
                    entering={FadeInDown.delay(200).duration(800)} 
                    style={[styles.section, { marginTop: -20 }]}
                >
                    <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 }}>
                        {!isUpdatingPlant && (
                            <View style={{ marginBottom: 24 }}>
                                <Text style={styles.label}>Select Plant Type</Text>
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false} 
                                    contentContainerStyle={{ gap: 10, paddingRight: 24 }}
                                    style={styles.chipsScroll}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={!selectedPlantClass ? styles.chipSelected : styles.chip}
                                        onPress={() => setSelectedPlantClass(undefined)}
                                    >
                                        <Text style={!selectedPlantClass ? styles.chipTextSelected : styles.chipText}>Auto Detect</Text>
                                    </TouchableOpacity>
                                    {plantTypes.map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            activeOpacity={0.7}
                                            style={selectedPlantClass === type ? styles.chipSelected : styles.chip}
                                            onPress={() => setSelectedPlantClass(type)}
                                        >
                                            <Text style={selectedPlantClass === type ? styles.chipTextSelected : styles.chipText}>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <View style={[styles.cameraArea, { marginVertical: 0, height: 300 }]}>
                            {selectedImageUri && !mutation.isPending ? (
                                <Image source={{ uri: selectedImageUri }} style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <View style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                                    <View style={styles.scannerFrame} />
                                    <Animated.View style={[styles.scanningLine, animatedScanStyle]} />
                                    
                                    {mutation.isPending ? (
                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <ActivityIndicator size="large" color="#10b981" />
                                            <Text style={styles.cameraText}>Analyzing Leaf...</Text>
                                            <Text style={styles.cameraHint}>Our AI is examining patterns.</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{ backgroundColor: '#f8fafc', padding: 24, borderRadius: 32, marginBottom: 20 }}>
                                                <Feather name="camera" size={48} color="#10b981" />
                                            </View>
                                            <Text style={styles.cameraText}>Position leaf in frame</Text>
                                            <Text style={styles.cameraHint}>Ensure the leaf is clearly visible.</Text>
                                        </>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={{ 
                        flexDirection: 'row', 
                        gap: 12, 
                        marginTop: 24 
                    }}>
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={takePhoto} 
                            disabled={mutation.isPending}
                            style={{ flex: 1.2 }}
                        >
                            <LinearGradient
                                colors={['#059669', '#10b981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.btnPrimary, mutation.isPending && { opacity: 0.6 }]}
                            >
                                <Feather name="camera" size={22} color="#fff" />
                                <Text style={styles.btnPrimaryText}>Take Photo</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.btnSecondary, { flex: 1, paddingHorizontal: 0 }, mutation.isPending && { opacity: 0.6 }]} 
                            onPress={pickImage} 
                            disabled={mutation.isPending}
                            activeOpacity={0.7}
                        >
                            <Feather name="image" size={22} color="#64748b" style={{ marginBottom: 4 }} />
                            <Text style={[styles.btnSecondaryText, { fontSize: 14 }]}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>



            <Modal
                animationType="slide"
                transparent={true}
                visible={isResultsModalVisible}
                onRequestClose={() => setResultsModalVisible(false)}
            >
                <BlurView intensity={30} style={styles.modalContainer}>
                    <View style={styles.bottomSheetContent}>
                        <View style={styles.bottomSheetHandle} />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 }}>
                            <Text style={[styles.modalTitle, { textAlign: 'left', marginBottom: 0 }]}>Diagnosis Results</Text>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                    <Feather name="x" size={20} color="#64748b" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}>
                            {selectedImageUri && (
                                <Image 
                                    source={{ uri: selectedImageUri }} 
                                    style={{ width: '100%', height: 240, borderRadius: 24, marginBottom: 20 }} 
                                    resizeMode="cover" 
                                />
                            )}
                            
                            <View style={{ 
                                backgroundColor: getStatusColor(analysisResult?.status) + '15',
                                borderRadius: 24, padding: 20, marginBottom: 20,
                                borderLeftWidth: 6, borderLeftColor: getStatusColor(analysisResult?.status)
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Primary Finding</Text>
                                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>
                                            {analysisResult?.primary_disease?.split('_')[1]?.toUpperCase() || 'HEALTHY'}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                            <View style={{ backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#1e293b' }}>
                                                    {analysisResult?.primary_disease?.split('_')[0]?.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 8 }}>
                                                Model Confidence: {Math.round((analysisResult?.predictions?.[0]?.disease_confidence || 0) * 100)}%
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '800', color: getStatusColor(analysisResult?.status) }}>
                                            {analysisResult?.overall_health_score}
                                        </Text>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8' }}>HEALTH</Text>
                                    </View>
                                </View>
                            </View>

                            {analysisResult?.predictions?.[0]?.recommendations && (
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={styles.label}>Recommendations</Text>
                                    {analysisResult.predictions[0].recommendations.map((rec, i) => (
                                        <View key={i} style={{ flexDirection: 'row', marginBottom: 8, gap: 12, alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#dcfce7', padding: 6, borderRadius: 10 }}>
                                                <Feather name="check" size={14} color="#10b981" />
                                            </View>
                                            <Text style={{ flex: 1, fontSize: 14, color: '#475569', fontWeight: '500' }}>{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                        </ScrollView>

                        <View style={{ paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', gap: 12 }}>
                            {isUpdatingPlant ? (
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    style={{ flex: 1 }}
                                    onPress={handleUpdatePlant}
                                >
                                    <LinearGradient
                                        colors={['#059669', '#10b981']}
                                        style={[styles.modalButton, { marginHorizontal: 0 }]}
                                    >
                                        <Text style={styles.modalButtonText}>Update Plant Info</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity 
                                        activeOpacity={0.8}
                                        style={{ flex: 1 }}
                                        onPress={handleAssignToPlant}
                                    >
                                        <View style={[styles.modalButton, { backgroundColor: '#f1f5f9', marginHorizontal: 0, borderWidth: 1, borderColor: '#e2e8f0' }]}>
                                            <Text style={[styles.modalButtonText, { color: '#475569' }]}>Assign Existing</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        activeOpacity={0.8}
                                        style={{ flex: 1 }}
                                        onPress={handleSaveAsNewPlant}
                                    >
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
