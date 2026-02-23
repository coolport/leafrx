import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal';
import { AnalysisResponse, ScanResult } from '../../components/leafrx/types';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export default function ScanScreen() {
    const insets = useSafeAreaInsets();
    const { plants, addScan, addPlant } = usePlantStore();

    const [isResultsModalVisible, setResultsModalVisible] = useState(false);
    const [isAddPlantModalVisible, setAddPlantModalVisible] = useState(false);
    const [isAssignPlantModalVisible, setAssignPlantModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

    const mutation = useMutation({
        mutationFn: ({ uri, type }: { uri: string, type?: string }) => apiService.analyzeImage(uri, type),
        onSuccess: (data) => {
            if (data.success) {
                setAnalysisResult(data);
                setResultsModalVisible(true);
            } else {
                Alert.alert('Analysis Failed', data.error || 'Unknown error occurred', [
                    { text: 'Try Again', onPress: () => {} },
                    { text: 'Suggestion: ' + data.suggestion, style: 'default' }
                ]);
            }
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
        }
    });

    const processImage = async (uri: string) => {
        setSelectedImageUri(uri);
        mutation.mutate({ uri });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7, // Lower quality for faster upload
        });

        if (!result.canceled) {
            processImage(result.assets[0].uri);
        }
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

        if (!result.canceled) {
            processImage(result.assets[0].uri);
        }
    };

    const handleSaveAsNewPlant = () => {
        setResultsModalVisible(false);
        setAddPlantModalVisible(true);
    };

    const handleAssignToPlant = () => {
        setResultsModalVisible(false);
        setAssignPlantModalVisible(true);
    };

    const onAddPlantSave = async (name: string, type: string) => {
        if (!analysisResult) return;

        // Add the plant
        await addPlant({
            name,
            type,
            health: analysisResult.overall_health_score || 0,
            lastChecked: new Date().toISOString(),
            status: analysisResult.status || 'warning',
        });

        // Save the scan globally
        await saveScanToStore();
        
        setAddPlantModalVisible(false);
        Alert.alert('Success', `${name} has been added and the scan result linked.`);
    };

    const onSelectExistingPlant = async (plant: any) => {
        await saveScanToStore(plant.id, plant.name);
        setAssignPlantModalVisible(false);
        Alert.alert('Success', `Scan result assigned to ${plant.name}.`);
    };

    const saveScanToStore = async (plantId?: string, plantName?: string) => {
        if (!analysisResult) return;

        const [plant, disease] = analysisResult.primary_disease?.split('_') || ['Unknown', 'Unknown'];

        const scanRecord: ScanResult = {
            id: analysisResult.image_id || Math.random().toString(),
            plantId,
            plantName: plantName || plant,
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageHeader, { paddingTop: insets.top }]}>
                    <Text style={styles.pageTitle}>Scan Leaf</Text>
                    <Text style={styles.pageSubtitle}>AI-powered disease detection</Text>
                </View>

                <View style={styles.section}>
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

                    <TouchableOpacity 
                        style={[styles.btnPrimary, mutation.isPending && { opacity: 0.6 }]} 
                        onPress={takePhoto}
                        disabled={mutation.isPending}
                    >
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.btnSecondary, mutation.isPending && { opacity: 0.6 }]} 
                        onPress={pickImage}
                        disabled={mutation.isPending}
                    >
                        <Text style={styles.btnSecondaryText}>Upload from Gallery</Text>
                    </TouchableOpacity>

                    <View style={styles.infoBox}>
                        <Feather name="info" size={20} color="#3b82f6" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoTitle}>Tips for best results:</Text>
                            <Text style={styles.infoText}>• Use natural lighting when possible</Text>
                            <Text style={styles.infoText}>• Keep camera steady and focused</Text>
                            <Text style={styles.infoText}>• Capture the entire leaf if possible</Text>
                        </View>
                    </View>
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
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={styles.modalTitle}>Analysis Results</Text>
                            <TouchableOpacity onPress={() => setResultsModalVisible(false)}>
                                <Feather name="x" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {selectedImageUri && (
                            <Image
                                source={{ uri: selectedImageUri }}
                                style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
                            />
                        )}

                        <View style={{ 
                            backgroundColor: getStatusColor(analysisResult?.status) + '15', 
                            padding: 12, 
                            borderRadius: 8, 
                            marginBottom: 16,
                            borderLeftWidth: 4,
                            borderLeftColor: getStatusColor(analysisResult?.status)
                        }}>
                            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Primary Finding:</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                                {analysisResult?.primary_disease?.split('_')[1]?.toUpperCase() || 'HEALTHY'}
                            </Text>
                            <Text style={{ fontSize: 14, color: getStatusColor(analysisResult?.status), fontWeight: '600' }}>
                                Overall Health Score: {analysisResult?.overall_health_score}%
                            </Text>
                        </View>

                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' }}>
                            Recommendations:
                        </Text>
                        <View style={{ maxHeight: 150 }}>
                            <ScrollView nestedScrollEnabled={true}>
                                {analysisResult?.predictions?.[0]?.recommendations.map((rec, i) => (
                                    <Text key={i} style={{ fontSize: 14, color: '#4b5563', marginBottom: 6 }}>• {rec}</Text>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={[styles.modalButtonContainer, { marginTop: 16 }]}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#3b82f6', flex: 1, marginRight: 8 }]}
                                onPress={handleAssignToPlant}
                            >
                                <Text style={styles.modalButtonText}>Assign to Plant</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#10b981', flex: 1 }]}
                                onPress={handleSaveAsNewPlant}
                            >
                                <Text style={styles.modalButtonText}>Save New</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <AddPlantModal
                isVisible={isAddPlantModalVisible}
                onClose={() => setAddPlantModalVisible(false)}
                onSave={onAddPlantSave}
            />

            <AssignPlantModal
                isVisible={isAssignPlantModalVisible}
                onClose={() => setAssignPlantModalVisible(false)}
                plants={plants}
                onSelectPlant={onSelectExistingPlant}
            />
        </SafeAreaView>
    );
}
