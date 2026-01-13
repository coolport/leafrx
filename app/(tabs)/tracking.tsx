import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { myPlants } from '../../constants/mockData';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { Link } from 'expo-router';

export default function TrackingScreen() {
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [newPlantName, setNewPlantName] = useState('');
    const [newPlantType, setNewPlantType] = useState('');
    const [newPlantLocation, setNewPlantLocation] = useState('');

    const handleAddPlant = () => {
        // Here you would typically add logic to save the new plant
        // For now, we'll just log the data and close the modal
        console.log('Adding plant:', { newPlantName, newPlantType, newPlantLocation });
        setAddModalVisible(false);
        setNewPlantName('');
        setNewPlantType('');
        setNewPlantLocation('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View>
                        <Text style={styles.pageTitle}>Plant Tracking</Text>
                        <Text style={styles.pageSubtitle}>Monitor growth over time</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
                        <Feather name="plus" size={18} color="#fff" />
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInput}>
                            <Feather name="search" size={20} color="#9ca3af" />
                            <TextInput
                                placeholder="Search plants..."
                                style={styles.searchInputText}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
                            {['All', 'Mango', 'Banana', 'Guava', 'Calamansi'].map((filter, i) => (
                                <TouchableOpacity key={filter} style={[styles.filterPill, i === 0 && styles.filterPillActive]}>
                                    <Text style={[styles.filterPillText, i === 0 && styles.filterPillTextActive]}>{filter}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {myPlants.map(plant => (
                        <PlantCard key={plant.id} plant={plant} />
                    ))}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Plant</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Plant Name"
                            value={newPlantName}
                            onChangeText={setNewPlantName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Plant Type"
                            value={newPlantType}
                            onChangeText={setNewPlantType}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={newPlantLocation}
                            onChangeText={setNewPlantLocation}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                                onPress={() => setAddModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#22c55e' }]}
                                onPress={handleAddPlant}
                            >
                                <Text style={styles.modalButtonText}>Add Plant</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
