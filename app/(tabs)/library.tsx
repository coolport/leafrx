import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['diseases'],
        queryFn: () => apiService.getDiseases(),
    });

    const filteredDiseases = data?.diseases.filter(d => 
        d.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.plant.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getPlantColor = (plant: string) => {
        switch (plant.toLowerCase()) {
            case 'mango': return '#f59e0b';
            case 'banana': return '#fbbf24';
            case 'guava': return '#10b981';
            case 'calamansi': return '#059669';
            default: return '#10b981';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.pageHeader, { paddingTop: insets.top }]}>
                    <Text style={styles.pageTitle}>Knowledge Library</Text>
                    <Text style={styles.pageSubtitle}>Learn about diseases and care</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInput}>
                            <Feather name="search" size={20} color="#9ca3af" />
                            <TextInput
                                placeholder="Search diseases, plants..."
                                style={styles.searchInputText}
                                placeholderTextColor="#9ca3af"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {isLoading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10b981" />
                            <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading library...</Text>
                        </View>
                    ) : error ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Feather name="alert-circle" size={48} color="#ef4444" />
                            <Text style={{ marginTop: 16, color: '#ef4444', fontWeight: 'bold' }}>Failed to load library</Text>
                            <Text style={{ marginTop: 8, color: '#6b7280', textAlign: 'center' }}>Please check your internet connection.</Text>
                        </View>
                    ) : (
                        filteredDiseases.map((disease) => (
                            <Link 
                                href={{ pathname: "/disease/[name]", params: { name: disease.id } }} 
                                asChild 
                                key={disease.id}
                            >
                                <TouchableOpacity style={styles.plantCard}>
                                    <View style={[styles.plantIcon, { backgroundColor: getPlantColor(disease.plant) }]}>
                                        <Text style={{ fontSize: 24 }}>🍃</Text>
                                    </View>
                                    <View style={styles.plantInfo}>
                                        <Text style={styles.plantName}>{disease.display_name}</Text>
                                        <Text style={styles.plantMeta}>Plant: {disease.plant.charAt(0).toUpperCase() + disease.plant.slice(1)}</Text>
                                        <View style={{ marginTop: 8 }}>
                                            <View style={[styles.severityBadge, { backgroundColor: '#f3f4f6' }]}>
                                                <Text style={[styles.severityText, { color: '#374151' }]}>Common</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </Link>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
