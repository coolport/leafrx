import React from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { myPlants } from '../../constants/mockData';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { Link } from 'expo-router';

export default function TrackingScreen() {
    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <View style={[styles.pageHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View>
                    <Text style={styles.pageTitle}>Plant Tracking</Text>
                    <Text style={styles.pageSubtitle}>Monitor growth over time</Text>
                </View>
                <TouchableOpacity style={styles.addBtn}>
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
    );
}
