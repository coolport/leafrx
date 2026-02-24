import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal, plantTypes } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal';
import { AnalysisResponse, Plant, ScanResult } from '../../components/leafrx/types';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';

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
    const [conditionsExpanded, setConditionsExpanded] = useState(false);
    const [selectedPlantClass, setSelectedPlantClass] = useState<string | undefined>(isUpdatingPlant ? params.plantType : undefined);

    // Reset state when the screen comes into focus and is NOT in update mode
    useFocusEffect(
        React.useCallback(() => {
            if (!params.plantId) {
                // Reset everything for a fresh scan
                setResultsModalVisible(false);
                setAddPlantModalVisible(false);
                setAssignPlantModalVisible(false);
                setSelectedImageUri(null);
                setAnalysisResult(null);
                setConditionsExpanded(false);
                setSelectedPlantClass(undefined);
                mutation.reset();
            } else {
                 // When updating, pre-select the plant type
                setSelectedPlantClass(params.plantType);
            }
        }, [params.plantId, params.plantType])
    );

    const mutation = useMutation({
        mutationFn: ({ uri, type }: { uri: string, type?: string }) => apiService.analyzeImage(uri, type),
        onSuccess: (data) => {
            if (data.success) {
                setAnalysisResult(data);
                setResultsModalVisible(true);
            } else {
                Alert.alert('Analysis Failed', data.error || 'Unknown error occurred', [
                    { text: 'Try Again', onPress: () => mutation.reset() },
                    { text: 'OK', style: 'default' }
                ]);
            }
        },
        onError: (error) => {
            Alert.alert('Connection Error', 'Failed to connect to the server. Please check your internet connection and try again.');
        }
    });

    const processImage = async (uri: string) => {
        setSelectedImageUri(uri);
        mutation.mutate({ uri, type: selectedPlantClass });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });
        if (!result.canceled) processImage(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        Alert.alert('Success', 'Plant has been updated with the new scan.');
        router.back(); // Go back to the plant detail screen
    };

    const onAddPlantSave = async (name: string, type: string) => {
        if (!analysisResult) return;
        const newPlant = await addPlant({
            name,
            type,
            health: analysisResult.overall_health_score || 0,
            lastChecked: new Date().toISOString(),
            status: analysisResult.status || 'warning',
        });
        await saveScanToStore(newPlant.id);
        setAddPlantModalVisible(false);
        Alert.alert('Success', `${name} has been added and the scan result linked.`);
        router.push(`/plant/${newPlant.id}`);
    };

    const onSelectExistingPlant = async (plant: Plant) => {
        await saveScanToStore(plant.id);
        setAssignPlantModalVisible(false);
        Alert.alert('Success', `Scan result assigned to ${plant.name}.`);
        router.push(`/plant/${plant.id}`);
    };

    const saveScanToStore = async (plantIdToSave?: string) => {
        if (!analysisResult) return;
        const plantInfo = plants.find(p => p.id === plantIdToSave);
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

    const filteredPlantsForAssignment = selectedPlantClass
        ? plants.filter(p => p.type === selectedPlantClass)
        : plants;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageHeader, { paddingTop: insets.top }]}>
                    <Text style={styles.pageTitle}>{isUpdatingPlant ? "Add New Scan" : "Scan Leaf"}</Text>
                    <Text style={styles.pageSubtitle}>
                        {isUpdatingPlant ? `For: ${plants.find(p => p.id === params.plantId)?.name}` : "AI-powered disease detection"}
                    </Text>
                </View>

                <View style={styles.section}>
                    {!isUpdatingPlant && (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Know the plant type? (Optional)</Text>
                            <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Select a type to improve accuracy.</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                <TouchableOpacity
                                    style={!selectedPlantClass ? styles.chipSelected : styles.chip}
                                    onPress={() => setSelectedPlantClass(undefined)}
                                >
                                    <Text style={!selectedPlantClass ? styles.chipTextSelected : styles.chipText}>Detect</Text>
                                </TouchableOpacity>
                                {plantTypes.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={selectedPlantClass === type ? styles.chipSelected : styles.chip}
                                        onPress={() => setSelectedPlantClass(type)}
                                    >
                                        <Text style={selectedPlantClass === type ? styles.chipTextSelected : styles.chipText}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.cameraArea}>
                        {mutation.isPending ? (
                            <View style={{ alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#10b981" />
                                <Text style={[styles.cameraText, { marginTop: 16 }]}>Analyzing Leaf...</Text>
                                <Text style={styles.cameraHint}>First scan may take up to 60 seconds</Text>
                            </View>
                        ) : (
                            <>
                                <Feather name="camera" size={64} color="#9ca3af" />
                                <Text style={styles.cameraText}>Position leaf in frame</Text>
                                <Text style={styles.cameraHint}>Make sure the leaf is well-lit and in focus</Text>
                            </>
                        )}
                    </View>

                    <TouchableOpacity style={[styles.btnPrimary, mutation.isPending && { opacity: 0.6 }]} onPress={takePhoto} disabled={mutation.isPending}>
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnSecondary, mutation.isPending && { opacity: 0.6 }]} onPress={pickImage} disabled={mutation.isPending}>
                        <Text style={styles.btnSecondaryText}>Upload from Gallery</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Scan Results Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isResultsModalVisible}
                onRequestClose={() => setResultsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { maxHeight: '92%', padding: 0 }]}>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                            <Text style={styles.modalTitle}>Analysis Results</Text>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <Feather name="x" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                            {selectedImageUri && <Image source={{ uri: selectedImageUri }} style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 16 }} resizeMode="cover" />}
                            
                            <View style={{ 
                                backgroundColor: getStatusColor(analysisResult?.status) + '18',
                                borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4,
                                borderLeftColor: getStatusColor(analysisResult?.status)
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>Primary Finding</Text>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
                                            {analysisResult?.primary_disease?.split('_')[1]?.toUpperCase() || 'HEALTHY'}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                            Plant Type: {analysisResult?.primary_disease?.split('_')[0] || 'Unknown'}
                                        </Text>
                                    </View>
                                    <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: getStatusColor(analysisResult?.status) + '25', borderWidth: 3, borderColor: getStatusColor(analysisResult?.status), alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: getStatusColor(analysisResult?.status) }}>
                                            {analysisResult?.overall_health_score}%
                                        </Text>
                                        <Text style={{ fontSize: 9, color: '#6b7280' }}>HEALTH</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Detected Conditions Snippet... */}

                        </ScrollView>

                        {/* Sticky Footer Buttons */}
                        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 10 }}>
                            {isUpdatingPlant ? (
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981', flex: 1 }]} onPress={handleUpdatePlant}>
                                    <Text style={styles.modalButtonText}>Update Plant</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#3b82f6', flex: 1 }]} onPress={handleAssignToPlant}>
                                        <Text style={styles.modalButtonText}>Assign to Plant</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981', flex: 1 }]} onPress={handleSaveAsNewPlant}>
                                        <Text style={styles.modalButtonText}>Save as New</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>
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
        </SafeAreaView>
    );
}
