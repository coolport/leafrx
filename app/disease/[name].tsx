import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { diseases } from '../../constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DiseaseDetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { name } = useLocalSearchParams();
    const diseaseName = Array.isArray(name) ? name[0] : name;
    const selectedDisease = diseases.find(d => d.name === diseaseName);

    if (!selectedDisease) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Stack.Screen options={{ headerShown: false }} />
                <View style={[styles.detailHeader, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: '#fff' }]}>Disease Not Found</Text>
                </View>
                <View style={styles.section}>
                    <Text style={{ color: '#6b7280' }}>The requested disease could not be found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.detailHeader, { paddingTop: insets.top, backgroundColor: selectedDisease.color }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: selectedDisease.textColor }]}>{selectedDisease.name}</Text>
                    <Text style={[styles.detailMeta, { color: selectedDisease.textColor }]}>Affects: {selectedDisease.affected}</Text>
                    <Text style={[styles.detailMeta, { color: selectedDisease.textColor }]}>Severity: {selectedDisease.severity}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={{ fontSize: 16, color: '#374151', marginBottom: 24 }}>
                        {selectedDisease.description}
                    </Text>

                    <Text style={styles.sectionTitle}>Symptoms</Text>
                    {selectedDisease.symptoms.map((symptom, index) => (
                        <Text key={index} style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>
                            • {symptom}
                        </Text>
                    ))}
                    <View style={{ marginBottom: 24 }} />

                    <Text style={styles.sectionTitle}>Treatment</Text>
                    {selectedDisease.treatment.map((treatment, index) => (
                        <Text key={index} style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>
                            • {treatment}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}