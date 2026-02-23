import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { AddPlantModal } from '../../components/leafrx/AddPlantModal';
import { usePlantStore } from '../../store/usePlantStore';

export default function TrackingScreen() {
    const insets = useSafeAreaInsets();
    const { plants, addPlant } = usePlantStore();
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const handleSaveNewPlant = (name: string, type: string, location: string) => {
        addPlant({
            name,
            type,
            location,
            health: 100, // Initial health
            lastChecked: new Date().toISOString(),
            status: 'healthy',
        });
        setAddModalVisible(false);
    };

    const filteredPlants = plants.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || plant.type.toLowerCase() === activeFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: insets.top }]}>
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
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
                            {['All', 'Mango', 'Banana', 'Guava', 'Calamansi'].map((filter) => (
                                <TouchableOpacity 
                                    key={filter} 
                                    style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                                    onPress={() => setActiveFilter(filter)}
                                >
                                    <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>{filter}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {filteredPlants.length > 0 ? (
                        filteredPlants.map(plant => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))
                    ) : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Feather name="search" size={48} color="#e5e7eb" />
                            <Text style={{ marginTop: 16, color: '#6b7280' }}>No plants found.</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <AddPlantModal
                isVisible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSave={handleSaveNewPlant}
            />
        </SafeAreaView>
    );
}
