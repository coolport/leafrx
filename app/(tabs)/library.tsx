import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
            <StatusBar barStyle="light-content" />
            <ScrollView 
                style={styles.screen} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <LinearGradient
                    colors={['#059669', '#10b981', '#34d399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 32 }]}
                >
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={styles.headerTitle}>Knowledge</Text>
                        <Text style={styles.headerSubtitle}>Learn about diseases and care</Text>
                    </View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -20 }]}>
                    <View 
                        style={{ 
                            backgroundColor: '#fff', 
                            borderRadius: 20, 
                            padding: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 4,
                            marginBottom: 24
                        }}
                    >
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            backgroundColor: '#f8fafc', 
                            paddingHorizontal: 16, 
                            paddingVertical: 12, 
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <Feather name="search" size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search diseases, plants..."
                                style={{ 
                                    flex: 1, 
                                    fontSize: 16, 
                                    color: '#1e293b', 
                                    fontWeight: '500',
                                    marginLeft: 12
                                }}
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {isLoading ? (
                        <View style={{ padding: 60, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10b981" />
                            <Text style={{ marginTop: 20, color: '#64748b', fontWeight: '600' }}>Loading library...</Text>
                        </View>
                    ) : error ? (
                        <View style={{ padding: 60, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#fee2e2', padding: 20, borderRadius: 30, marginBottom: 20 }}>
                                <Feather name="alert-circle" size={48} color="#ef4444" />
                            </View>
                            <Text style={{ fontSize: 18, color: '#1e293b', fontWeight: '800' }}>Sync Error</Text>
                            <Text style={{ marginTop: 8, color: '#64748b', textAlign: 'center', lineHeight: 20 }}>We couldn't reach the library server.</Text>
                        </View>
                    ) : (
                        filteredDiseases.map((disease) => (
                            <Link 
                                href={{ pathname: "/disease/[name]", params: { name: disease.id } }} 
                                asChild 
                                key={disease.id}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.7} 
                                    style={[styles.plantCard, { padding: 20, marginBottom: 16 }]}
                                >
                                    <View style={[styles.plantIcon, { width: 64, height: 64, borderRadius: 20, backgroundColor: getPlantColor(disease.plant) + '15' }]}>
                                        <Text style={{ fontSize: 32 }}>🍃</Text>
                                    </View>
                                    <View style={[styles.plantInfo, { marginLeft: 8 }]}>
                                        <Text style={[styles.plantName, { fontSize: 19 }]} numberOfLines={1}>{disease.display_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                            <View style={{ backgroundColor: getPlantColor(disease.plant), width: 8, height: 8, borderRadius: 4, marginRight: 8 }} />
                                            <Text style={[styles.plantMeta, { fontWeight: '800', color: '#64748b', fontSize: 13, letterSpacing: 0.5 }]}>
                                                {disease.plant.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' }}>
                                        <Feather name="chevron-right" size={22} color="#94a3b8" />
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
