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
    const [plantType, setPlantType] = useState('');
    const [plantLocation, setPlantLocation] = useState('');

    const handleSave = () => {
        if (!plantName || !plantType || !plantLocation) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
        onSave(plantName, plantType, plantLocation);
        setPlantName('');
        setPlantType('');
        setPlantLocation('');
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
                    <TextInput
                        style={styles.input}
                        placeholder="Plant Name"
                        value={plantName}
                        onChangeText={setPlantName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Plant Type"
                        value={plantType}
                        onChangeText={setPlantType}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={plantLocation}
                        onChangeText={setPlantLocation}
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#22c55e' }]}
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
