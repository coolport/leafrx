import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Modal, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import * as ImagePicker from 'expo-image-picker';
import { AddPlantModal } from '../../components/leafrx/AddPlantModal';
import { AssignPlantModal } from '../../components/leafrx/AssignPlantModal'; // Import AssignPlantModal
import { Plant } from '../../components/leafrx/types'; // Import Plant type
import { myPlants } from '../../constants/mockData'; // Import mock plants for assignment

export default function ScanScreen() {
    const [isResultsModalVisible, setResultsModalVisible] = useState(false);
    const [isAddPlantModalVisible, setAddPlantModalVisible] = useState(false);
    const [isAssignPlantModalVisible, setAssignPlantModalVisible] = useState(false);

    const [simulatedResults, setSimulatedResults] = useState<{
        disease: string;
        severity: string;
        treatment: string;
        imageUri?: string;
    } | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSimulatedResults({
                disease: 'Early Leaf Spot',
                severity: 'Moderate',
                treatment: 'Apply a broad-spectrum fungicide every 7-10 days.',
                imageUri: result.assets[0].uri,
            });
            setResultsModalVisible(true);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSimulatedResults({
                disease: 'Anthracnose',
                severity: 'Severe',
                treatment: 'Remove infected plant parts and apply copper-based fungicides.',
                imageUri: result.assets[0].uri,
            });
            setResultsModalVisible(true);
        }
    };

    const handleAssignToPlant = () => {
        setResultsModalVisible(false); // Close results modal
        setAssignPlantModalVisible(true); // Open assign plant modal
    };

    const handleSaveNewPlant = () => {
        setResultsModalVisible(false); // Close results modal
        setAddPlantModalVisible(true); // Open add new plant modal
    };

    const onAddPlantSave = (plantName: string, plantType: string, plantLocation: string) => {
        Alert.alert('Plant Added', `Name: ${plantName}, Type: ${plantType}, Location: ${plantLocation}. \n\nScan results would be linked here.`);
        // Here you would typically save the new plant and link the scan results
        setAddPlantModalVisible(false); // Close the add plant modal
    };

    const onSelectExistingPlant = (plant: Plant) => {
        Alert.alert('Assigned', `Scan results assigned to ${plant.name}.`);
        setAssignPlantModalVisible(false); // Close the assign plant modal
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Scan Leaf</Text>
                    <Text style={styles.pageSubtitle}>Take or upload a photo of the leaf</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.cameraArea}>
                        <Feather name="camera" size={64} color="#9ca3af" />
                        <Text style={styles.cameraText}>Position leaf in frame</Text>
                        <Text style={styles.cameraHint}>Make sure the leaf is well-lit and in focus</Text>
                    </View>

                    <TouchableOpacity style={styles.btnPrimary} onPress={takePhoto}>
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSecondary} onPress={pickImage}>
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
                        <Text style={styles.modalTitle}>Scan Results</Text>
                        {simulatedResults?.imageUri && (
                            <Image
                                source={{ uri: simulatedResults.imageUri }}
                                style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
                            />
                        )}
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                            Disease: {simulatedResults?.disease}
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 8 }}>
                            Severity: {simulatedResults?.severity}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                            Treatment: {simulatedResults?.treatment}
                        </Text>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                                onPress={() => setResultsModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#3b82f6' }]}
                                onPress={handleAssignToPlant}
                            >
                                <Text style={styles.modalButtonText}>Assign to Plant</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.btnPrimary, { marginTop: 12, width: '100%' }]}
                            onPress={handleSaveNewPlant}
                        >
                            <Text style={styles.btnPrimaryText}>Save as New Plant</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add New Plant Modal (reusing the component) */}
            <AddPlantModal
                isVisible={isAddPlantModalVisible}
                onClose={() => setAddPlantModalVisible(false)}
                onSave={onAddPlantSave}
            />

            {/* Assign Plant Modal */}
            <AssignPlantModal
                isVisible={isAssignPlantModalVisible}
                onClose={() => setAssignPlantModalVisible(false)}
                plants={myPlants}
                onSelectPlant={onSelectExistingPlant}
            />
        </SafeAreaView>
    );
}
