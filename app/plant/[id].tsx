import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Modal, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from '../../constants/styles';
import { myPlants, chartLabels } from '../../constants/mockData';
import { Chart } from '../../components/leafrx/Chart';
import { StatCard } from '../../components/leafrx/StatCard';
import { Timeline } from '../../components/leafrx/Timeline';
import * as ImagePicker from 'expo-image-picker';

export default function DetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const selectedPlant = myPlants.find(p => p.id.toString() === id);

    const [isNewEntryModalVisible, setNewEntryModalVisible] = useState(false);
    const [newEntryImageUri, setNewEntryImageUri] = useState<string | null>(null);
    const [newEntryNotes, setNewEntryNotes] = useState('');

    const takePhotoForEntry = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewEntryImageUri(result.assets[0].uri);
            setNewEntryModalVisible(true);
        }
    };

    const handleSaveEntry = () => {
        Alert.alert('New Entry Added', `Health Score: 86%, Notes: ${newEntryNotes}. Image: ${newEntryImageUri ? 'Yes' : 'No'}`);
        // Here you would typically save the new entry data to the plant's timeline
        setNewEntryModalVisible(false);
        setNewEntryImageUri(null);
        setNewEntryNotes('');
    };

    if (!selectedPlant) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Plant not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={[styles.detailHeader, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Text style={styles.backBtn}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.detailTop}>
                        <View style={styles.detailIcon}>
                            <Text style={{ fontSize: 32 }}>🌿</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
                            <Text style={styles.detailMeta}>{selectedPlant.type} • {selectedPlant.location}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.detailScore}>{selectedPlant.health}%</Text>
                            <Text style={styles.detailLabel}>Health</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Chart data={selectedPlant.healthTrend} labels={chartLabels} />

                    <View style={styles.statsGrid}>
                        <StatCard icon="trending-up" label="Days Tracked" value="45" color='#22c55e' />
                        <StatCard icon="calendar" label="Total Scans" value="23" color='#3b82f6' />
                        <StatCard icon="alert-triangle" label="Alerts" value="3" color='#eab308' />
                    </View>

                    <Timeline />

                    <TouchableOpacity
                        style={[styles.btnPrimary, { marginTop: 16, marginBottom: 100 }]}
                        onPress={takePhotoForEntry}
                    >
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Add New Entry</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* New Entry Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isNewEntryModalVisible}
                onRequestClose={() => setNewEntryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Entry</Text>
                        {newEntryImageUri && (
                            <Image
                                source={{ uri: newEntryImageUri }}
                                style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
                            />
                        )}
                        <Text style={{ fontSize: 16, marginBottom: 16 }}>Health Score: 86%</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Notes (e.g., observed yellowing)"
                            value={newEntryNotes}
                            onChangeText={setNewEntryNotes}
                            multiline
                            numberOfLines={3}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                                onPress={() => setNewEntryModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#22c55e' }]}
                                onPress={handleSaveEntry}
                            >
                                <Text style={styles.modalButtonText}>Save Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
