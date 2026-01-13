import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';
import { Plant } from './types';

type AssignPlantModalProps = {
    isVisible: boolean;
    onClose: () => void;
    plants: Plant[];
    onSelectPlant: (plant: Plant) => void;
};

export function AssignPlantModal({ isVisible, onClose, plants, onSelectPlant }: AssignPlantModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Assign to Plant</Text>
                    <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
                        {plants.length > 0 ? (
                            plants.map(plant => (
                                <TouchableOpacity
                                    key={plant.id}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f3f4f6',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                    onPress={() => onSelectPlant(plant)}
                                >
                                    <Text style={{ fontSize: 16, color: '#1f2937' }}>{plant.name}</Text>
                                    <Feather name="chevron-right" size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: '#6b7280' }}>No plants available. Add a new plant first!</Text>
                        )}
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: '#e5e7eb', width: '100%', marginHorizontal: 0 }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
