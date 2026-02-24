import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../constants/styles';

type AddPlantModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: (plantName: string, plantType: string) => void;
    initialPlantType?: string;
};

export const plantTypes = ['Mango', 'Banana', 'Guava', 'Calamansi'];

export function AddPlantModal({ isVisible, onClose, onSave, initialPlantType }: AddPlantModalProps) {
    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState(initialPlantType || 'Mango');

    useEffect(() => {
        if (initialPlantType && isVisible) {
            setPlantType(initialPlantType);
        }
        if (!isVisible) {
            setPlantName('');
            setPlantType(initialPlantType || 'Mango');
        }
    }, [initialPlantType, isVisible]);

    const handleSave = () => {
        if (!plantName.trim() || !plantType) {
            Alert.alert('Missing Info', 'Please provide a name for your plant.');
            return;
        }
        onSave(plantName.trim(), plantType);
        onClose(); 
    };

    const handleClose = () => {
        setPlantName('');
        setPlantType(initialPlantType || 'Mango');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Plant</Text>
                    
                    <Text style={styles.label}>Plant Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. My Backyard Mango"
                        value={plantName}
                        onChangeText={setPlantName}
                    />

                    <Text style={styles.label}>Plant Type</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                        {plantTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setPlantType(type)}
                                style={plantType === type ? styles.chipSelected : styles.chip}
                            >
                                <Text style={plantType === type ? styles.chipTextSelected : styles.chipText}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
                            onPress={handleClose}
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
