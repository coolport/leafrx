import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from '../../constants/styles';
import { useColors } from '../../hooks/use-colors';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { AddPlantModal } from '../../components/leafrx/AddPlantModal';
import { usePlantStore } from '../../store/usePlantStore';

export default function TrackingScreen() {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const styles = createStyles(colors);
    const { plants, addPlant } = usePlantStore();
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const handleSaveNewPlant = async (name: string, type: string) => {
        await addPlant({
            name,
            type,
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView 
                style={styles.screen} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <LinearGradient
                    colors={colors.headerGradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 32, marginBottom: 24 }]}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
                        <View>
                            <Text style={styles.headerTitle}>Plant Tracking</Text>
                            <Text style={styles.headerSubtitle}>Monitor growth over time</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.bellBtn} 
                            onPress={() => setAddModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -20 }]}>
                    <View 
                        style={{ 
                            backgroundColor: colors.card, 
                            borderRadius: 24, 
                            padding: 20,
                            shadowColor: colors.cardShadow,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 12,
                            elevation: 4,
                            marginBottom: 24
                        }}
                    >
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            backgroundColor: colors.background, 
                            paddingHorizontal: 16, 
                            paddingVertical: 12, 
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 16
                        }}>
                            <Feather name="search" size={20} color={colors.textMuted} />
                            <TextInput
                                placeholder="Search your plants..."
                                style={{ 
                                    flex: 1, 
                                    fontSize: 16, 
                                    color: colors.text, 
                                    fontWeight: '500',
                                    marginLeft: 12
                                }}
                                placeholderTextColor={colors.textMuted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
                            {['All', 'Mango', 'Banana', 'Guava', 'Calamansi'].map((filter) => (
                                <TouchableOpacity 
                                    key={filter} 
                                    style={[
                                        styles.filterPill, 
                                        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: activeFilter === filter ? colors.primary : colors.background, borderWidth: 1, borderColor: colors.border },
                                        activeFilter === filter && { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }
                                    ]}
                                    onPress={() => setActiveFilter(filter)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{ 
                                        fontSize: 13, 
                                        fontWeight: '700', 
                                        color: activeFilter === filter ? '#fff' : colors.textSecondary 
                                    }}>{filter.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {filteredPlants.length > 0 ? (
                        filteredPlants.map((plant) => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))
                    ) : (
                        <View style={{ padding: 60, alignItems: 'center' }}>
                            <View style={{ backgroundColor: colors.background, padding: 24, borderRadius: 32, marginBottom: 20 }}>
                                <Feather name="search" size={48} color={colors.textMuted} />
                            </View>
                            <Text style={{ fontSize: 18, color: colors.text, fontWeight: '800' }}>No Plants Found</Text>
                            <Text style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>Try adjusting your search or filter.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <AddPlantModal
                isVisible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSave={handleSaveNewPlant}
            />
        </View>
    );
}
