import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export default function DiseaseDetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { name } = useLocalSearchParams();
    const diseaseId = Array.isArray(name) ? name[0] : name;

    const { data: selectedDisease, isLoading, error } = useQuery({
        queryKey: ['disease', diseaseId],
        queryFn: () => apiService.getDiseaseDetails(diseaseId),
        enabled: !!diseaseId,
    });

    const getPlantColor = (plant: string) => {
        switch (plant?.toLowerCase()) {
            case 'mango': return '#f59e0b';
            case 'banana': return '#fbbf24';
            case 'guava': return '#10b981';
            case 'calamansi': return '#059669';
            default: return '#10b981';
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#10b981" />
                    <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !selectedDisease) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Stack.Screen options={{ headerShown: false }} />
                <View style={[styles.detailHeader, { paddingTop: insets.top, backgroundColor: '#ef4444' }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: '#fff' }]}>Disease Not Found</Text>
                </View>
                <View style={styles.section}>
                    <Text style={{ color: '#6b7280' }}>The requested disease could not be found or there was a network error.</Text>
                    <TouchableOpacity 
                        style={[styles.primaryButton, { marginTop: 20 }]} 
                        onPress={() => router.back()}
                    >
                        <Text style={styles.primaryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const plantColor = getPlantColor(selectedDisease.plant);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.detailHeader, { paddingTop: insets.top, backgroundColor: plantColor }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: '#fff' }]}>{selectedDisease.display_name}</Text>
                    <Text style={[styles.detailMeta, { color: '#fff' }]}>Plant: {selectedDisease.plant.charAt(0).toUpperCase() + selectedDisease.plant.slice(1)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={{ fontSize: 16, color: '#374151', marginBottom: 24, lineHeight: 24 }}>
                        {selectedDisease.description || "No description available for this disease."}
                    </Text>

                    <Text style={styles.sectionTitle}>Recommendations & Treatment</Text>
                    {selectedDisease.recommendations && selectedDisease.recommendations.length > 0 ? (
                        selectedDisease.recommendations.map((rec, index) => (
                            <View key={index} style={{ flexDirection: 'row', marginBottom: 12 }}>
                                <Text style={{ fontSize: 16, color: '#10b981', marginRight: 8 }}>✓</Text>
                                <Text style={{ fontSize: 16, color: '#374151', flex: 1, lineHeight: 22 }}>
                                    {rec}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 16, color: '#6b7280', fontStyle: 'italic' }}>
                            No specific recommendations found. Consult an agricultural expert.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}