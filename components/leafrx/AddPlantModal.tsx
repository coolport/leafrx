import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../constants/styles';

type AddPlantModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: (plantName: string, plantType: string, plantLocation: string) => void;
};

export function AddPlantModal({ isVisible, onClose, onSave }: AddPlantModalProps) {
    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState('Mango');
    const plantTypes = ['Mango', 'Banana', 'Guava', 'Calamansi'];

    const handleSave = () => {
        if (!plantName || !plantType) {
            Alert.alert('Error', 'Please enter a plant name.');
            return;
        }
        // Location is removed from UI but kept in signature for compatibility, passing empty string
        onSave(plantName, plantType, '');
        setPlantName('');
        setPlantType('Mango');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Plant</Text>
                    
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8, marginLeft: 4 }}>Plant Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. My Backyard Mango"
                        value={plantName}
                        onChangeText={setPlantName}
                    />

                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8, marginLeft: 4 }}>Plant Type</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                        {plantTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setPlantType(type)}
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    borderRadius: 20,
                                    backgroundColor: plantType === type ? '#10b981' : '#f3f4f6',
                                    marginRight: 8,
                                    marginBottom: 8,
                                    borderWidth: 1,
                                    borderColor: plantType === type ? '#10b981' : '#e5e7eb',
                                }}
                            >
                                <Text style={{ 
                                    color: plantType === type ? '#fff' : '#4b5563',
                                    fontWeight: plantType === type ? 'bold' : 'normal'
                                }}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                            onPress={handleSave}
                        >
                            <Text style={styles.modalButtonText}>Add Plant</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
