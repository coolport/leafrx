import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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

    const getPlantEmoji = (plant: string) => {
        switch (plant.toLowerCase()) {
            case 'mango': return '🥭';
            case 'banana': return '🍌';
            case 'guava': return '🍈';
            case 'calamansi': return '🍋';
            default: return '🍃';
        }
    };

    // Group diseases by plant
    const grouped = filteredDiseases.reduce((acc, disease) => {
        const key = disease.plant;
        if (!acc[key]) acc[key] = [];
        acc[key].push(disease);
        return acc;
    }, {} as Record<string, typeof filteredDiseases>);

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
                    <Animated.View entering={FadeInDown.duration(800)} style={{ paddingHorizontal: 24 }}>
                        <Text style={styles.headerTitle}>Knowledge</Text>
                        <Text style={styles.headerSubtitle}>Learn about diseases and care</Text>
                    </Animated.View>
                </LinearGradient>

                <View style={[styles.section, { marginTop: -24 }]}>
                    {/* Search Bar */}
                    <Animated.View 
                        entering={FadeInDown.delay(200).duration(800)} 
                        style={{ 
                            backgroundColor: '#fff', 
                            borderRadius: 20, 
                            padding: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 3,
                            marginBottom: 24
                        }}
                    >
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            backgroundColor: '#f8fafc', 
                            paddingHorizontal: 14, 
                            paddingVertical: 10, 
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <Feather name="search" size={18} color="#94a3b8" />
                            <TextInput
                                placeholder="Search diseases, plants..."
                                style={{ 
                                    flex: 1, 
                                    fontSize: 15, 
                                    color: '#1e293b', 
                                    fontWeight: '600',
                                    marginLeft: 10
                                }}
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </Animated.View>

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
                    ) : searchQuery ? (
                        // Flat list when searching
                        <View style={{ gap: 12 }}>
                            {filteredDiseases.map((disease, index) => (
                                <Animated.View
                                    key={disease.id}
                                    entering={FadeInUp.delay(index * 60).duration(400)}
                                >
                                    <HorizontalCard disease={disease} getPlantColor={getPlantColor} getPlantEmoji={getPlantEmoji} />
                                </Animated.View>
                            ))}
                        </View>
                    ) : (
                        // Grouped by plant
                        Object.entries(grouped).map(([plant, diseases], groupIndex) => (
                            <Animated.View
                                key={plant}
                                entering={FadeInUp.delay(groupIndex * 100).duration(500)}
                                style={{ marginBottom: 28 }}
                            >
                                {/* Plant Section Header */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                    paddingHorizontal: 4
                                }}>
                                    <Text style={{ fontSize: 20, marginRight: 8 }}>{getPlantEmoji(plant)}</Text>
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '800',
                                        color: getPlantColor(plant),
                                        letterSpacing: 1.2,
                                        textTransform: 'uppercase'
                                    }}>
                                        {plant}
                                    </Text>
                                    <View style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: getPlantColor(plant) + '25',
                                        marginLeft: 10
                                    }} />
                                    {/* <Text style={{ */}
                                    {/*     fontSize: 12, */}
                                    {/*     color: '#94a3b8', */}
                                    {/*     fontWeight: '600', */}
                                    {/*     marginLeft: 10 */}
                                    {/* }}> */}
                                    {/*     {/* {diseases.length} {diseases.length === 1 ? 'disease' : 'diseases'} */} */}
                                    {/*     4 {diseases.length === 1 ? 'disease' : 'diseases'} */}
                                    {/* </Text> */}
                                </View>

                                {/* Horizontal scroll of cards */}
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 12, paddingHorizontal: 2, paddingBottom: 4 }}
                                >
                                    {diseases.map((disease) => (
                                        <Link
                                            key={disease.id}
                                            href={{ pathname: "/disease/[name]", params: { name: disease.id } }}
                                            asChild
                                        >
                                            <TouchableOpacity
                                                activeOpacity={0.75}
                                                style={{
                                                    width: 160,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 20,
                                                    padding: 16,
                                                    shadowColor: getPlantColor(disease.plant),
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 12,
                                                    elevation: 4,
                                                    borderWidth: 1,
                                                    borderColor: '#f1f5f9',
                                                }}
                                            >
                                                {/* Card top accent */}
                                                <View style={{
                                                    width: '100%',
                                                    height: 4,
                                                    borderRadius: 4,
                                                    backgroundColor: getPlantColor(disease.plant) + '30',
                                                    marginBottom: 14
                                                }}>
                                                    <View style={{
                                                        width: '60%',
                                                        height: '100%',
                                                        borderRadius: 4,
                                                        backgroundColor: getPlantColor(disease.plant)
                                                    }} />
                                                </View>

                                                {/* Icon */}
                                                <View style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 14,
                                                    backgroundColor: getPlantColor(disease.plant) + '15',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: 12
                                                }}>
                                                    <Text style={{ fontSize: 26 }}>{getPlantEmoji(disease.plant)}</Text>
                                                </View>

                                                {/* Name */}
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: '700',
                                                    color: '#1e293b',
                                                    lineHeight: 20,
                                                    marginBottom: 8,
                                                    flexShrink: 1
                                                }} numberOfLines={2}>
                                                    {disease.display_name}
                                                </Text>

                                                {/* Footer */}
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginTop: 'auto'
                                                }}>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        backgroundColor: getPlantColor(disease.plant) + '15',
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 4,
                                                        borderRadius: 8
                                                    }}>
                                                        <View style={{
                                                            width: 5,
                                                            height: 5,
                                                            borderRadius: 2.5,
                                                            backgroundColor: getPlantColor(disease.plant),
                                                            marginRight: 5
                                                        }} />
                                                        <Text style={{
                                                            fontSize: 10,
                                                            fontWeight: '800',
                                                            color: getPlantColor(disease.plant),
                                                            letterSpacing: 0.5
                                                        }}>
                                                            {disease.plant.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                    <Feather name="arrow-right" size={14} color="#cbd5e1" />
                                                </View>
                                            </TouchableOpacity>
                                        </Link>
                                    ))}
                                </ScrollView>
                            </Animated.View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// Reusable horizontal row card (used in search results)
function HorizontalCard({ disease, getPlantColor, getPlantEmoji }: {
    disease: any;
    getPlantColor: (p: string) => string;
    getPlantEmoji: (p: string) => string;
}) {
    return (
        <Link href={{ pathname: "/disease/[name]", params: { name: disease.id } }} asChild>
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 18,
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                    borderLeftWidth: 4,
                    borderLeftColor: getPlantColor(disease.plant),
                }}
            >
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: getPlantColor(disease.plant) + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    flexShrink: 0
                }}>
                    <Text style={{ fontSize: 26 }}>{getPlantEmoji(disease.plant)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: 4
                    }} numberOfLines={1}>
                        {disease.display_name}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: getPlantColor(disease.plant) + '15',
                        alignSelf: 'flex-start',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8
                    }}>
                        <View style={{
                            width: 5,
                            height: 5,
                            borderRadius: 2.5,
                            backgroundColor: getPlantColor(disease.plant),
                            marginRight: 5
                        }} />
                        <Text style={{
                            fontSize: 10,
                            fontWeight: '800',
                            color: getPlantColor(disease.plant),
                            letterSpacing: 0.5
                        }}>
                            {disease.plant.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <Feather name="chevron-right" size={18} color="#cbd5e1" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
        </Link>
    );
}
