import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
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
            case 'banana': return '#eab308';
            case 'guava': return '#10b981';
            case 'calamansi': return '#059669';
            default: return '#10b981';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView 
                style={styles.screen} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={[styles.pageHeader, { paddingTop: insets.top + 16, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }]}>
                    <Text style={[styles.pageTitle, { fontSize: 28, fontWeight: '800' }]}>Knowledge</Text>
                    <Text style={[styles.pageSubtitle, { fontSize: 16, fontWeight: '500' }]}>Learn about diseases and care</Text>
                </View>

                <View style={styles.section}>
                    <Animated.View entering={FadeInDown.delay(200).duration(800)} style={[styles.searchContainer, { borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, padding: 20 }]}>
                        <View style={[styles.searchInput, { backgroundColor: '#f8fafc', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' }]}>
                            <Feather name="search" size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search diseases, plants..."
                                style={[styles.searchInputText, { fontWeight: '600' }]}
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </Animated.View>

                    {isLoading ? (
                        <View style={{ padding: 60, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10b981" />
                            <Text style={{ marginTop: 20, color: '#64748b', fontWeight: '600' }}>Loading knowledge base...</Text>
                        </View>
                    ) : error ? (
                        <View style={{ padding: 60, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#fee2e2', padding: 20, borderRadius: 30, marginBottom: 20 }}>
                                <Feather name="alert-circle" size={48} color="#ef4444" />
                            </View>
                            <Text style={{ fontSize: 18, color: '#1e293b', fontWeight: '800' }}>Sync Error</Text>
                            <Text style={{ marginTop: 8, color: '#64748b', textAlign: 'center', lineHeight: 20 }}>We couldn't reach the library server. Please check your connection.</Text>
                        </View>
                    ) : (
                        filteredDiseases.map((disease, index) => (
                            <Animated.View 
                                key={disease.id}
                                entering={FadeInRight.delay(400 + (index * 100)).duration(600)}
                            >
                                <Link 
                                    href={{ pathname: "/disease/[name]", params: { name: disease.id } }} 
                                    asChild 
                                >
                                    <TouchableOpacity 
                                        activeOpacity={0.7} 
                                        style={[styles.plantCard, { paddingVertical: 12 }]}
                                    >
                                        <View style={[styles.plantIcon, { backgroundColor: getPlantColor(disease.plant) + '15' }]}>
                                            <Text style={{ fontSize: 28 }}>🍃</Text>
                                        </View>
                                        <View style={styles.plantInfo}>
                                            <Text style={[styles.plantName, { fontSize: 18 }]}>{disease.display_name}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                <View style={{ backgroundColor: getPlantColor(disease.plant), width: 8, height: 8, borderRadius: 4, marginRight: 6 }} />
                                                <Text style={[styles.plantMeta, { fontWeight: '700', color: '#64748b' }]}>
                                                    {disease.plant.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 14 }}>
                                            <Feather name="chevron-right" size={20} color="#94a3b8" />
                                        </View>
                                    </TouchableOpacity>
                                </Link>
                            </Animated.View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
