import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { Chart } from '../../components/leafrx/Chart';
import { StatCard } from '../../components/leafrx/StatCard';
import { Timeline } from '../../components/leafrx/Timeline';
import * as ImagePicker from 'expo-image-picker';
import { usePlantStore } from '../../store/usePlantStore';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { AnalysisResponse, ScanResult } from '../../components/leafrx/types';

export default function DetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const plantId = Array.isArray(id) ? id[0] : id;
    
    const { plants, getPlantScans, addScan } = usePlantStore();
    const selectedPlant = plants.find(p => p.id === plantId);
    const plantScans = getPlantScans(plantId);

    const [isNewEntryModalVisible, setNewEntryModalVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [entryImageUri, setEntryImageUri] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (uri: string) => apiService.analyzeImage(uri, selectedPlant?.type),
        onSuccess: (data) => {
            if (data.success) {
                setAnalysisResult(data);
                setNewEntryModalVisible(true);
            } else {
                Alert.alert('Analysis Failed', data.error || 'Check image quality');
            }
        },
    });

    const takePhotoForEntry = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is required.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setEntryImageUri(result.assets[0].uri);
            mutation.mutate(result.assets[0].uri);
        }
    };

    const pickImageForEntry = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setEntryImageUri(result.assets[0].uri);
            mutation.mutate(result.assets[0].uri);
        }
    };

    const handleSaveEntry = () => {
        if (!analysisResult) return;

        const [plantPrefix, disease] = analysisResult.primary_disease?.split('_') || ['Unknown', 'Unknown'];

        const scanRecord: ScanResult = {
            id: analysisResult.image_id || Math.random().toString(),
            plantId: plantId,
            plantName: selectedPlant?.name || '',
            disease: disease || 'Unknown',
            severity: analysisResult.predictions?.[0]?.severity || 'Unknown',
            date: new Date().toISOString(),
            healthScore: analysisResult.overall_health_score || 0,
            predictions: analysisResult.predictions || [],
        };

        addScan(scanRecord);
        setNewEntryModalVisible(false);
        setAnalysisResult(null);
        setEntryImageUri(null);
        Alert.alert('Success', 'Plant status updated.');
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
                            <Text style={[styles.detailMeta, { color: '#f3f4f6' }]}>{selectedPlant.type} • {selectedPlant.location}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.detailScore, { color: '#fff' }]}>{Math.round(selectedPlant.health)}%</Text>
                            <Text style={[styles.detailLabel, { color: '#f3f4f6' }]}>Health</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    {mutation.isPending && (
                        <View style={{ position: 'absolute', top: -40, left: 0, right: 0, zIndex: 10, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 20, elevation: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#10b981" />
                                <Text style={{ marginLeft: 8, color: '#374151', fontWeight: '500' }}>Analyzing Leaf...</Text>
                            </View>
                        </View>
                    )}

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
                            onPress={takePhotoForEntry}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Feather name="camera" size={20} color="#fff" />
                                    <Text style={styles.btnPrimaryText}>Take Photo Scan</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btnSecondary, { marginTop: 12, borderColor: getStatusColor(selectedPlant.status) }]}
                            onPress={pickImageForEntry}
                            disabled={mutation.isPending}
                        >
                            <Text style={[styles.btnSecondaryText, { color: getStatusColor(selectedPlant.status) }]}>
                                Upload from Gallery
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isNewEntryModalVisible}
                onRequestClose={() => setNewEntryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>New Scan Results</Text>
                        {entryImageUri && (
                            <Image
                                source={{ uri: entryImageUri }}
                                style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
                            />
                        )}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, color: '#374151', fontWeight: '600' }}>
                                Detection: {analysisResult?.primary_disease?.split('_')[1]?.toUpperCase() || 'HEALTHY'}
                            </Text>
                            <Text style={{ fontSize: 14, color: getStatusColor(analysisResult?.status || ''), marginTop: 4 }}>
                                Health Score: {analysisResult?.overall_health_score}%
                            </Text>
                        </View>
                        
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                                onPress={() => setNewEntryModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                                onPress={handleSaveEntry}
                            >
                                <Text style={styles.modalButtonText}>Update Plant</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
