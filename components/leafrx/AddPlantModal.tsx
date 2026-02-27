import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';

type AddPlantModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: (plantName: string, plantType: string) => void;
    initialPlantType?: string;
};

export const plantTypes = ['Mango', 'Banana', 'Guava', 'Calamansi'];

function getPlantEmoji(type: string) {
    const t = type.toLowerCase();
    if (t.includes('mango')) return '🥭';
    if (t.includes('banana')) return '🍌';
    if (t.includes('guava')) return '🍐';
    if (t.includes('calamansi')) return '🫒';
    return '🌿';
}

export function AddPlantModal({ isVisible, onClose, onSave, initialPlantType }: AddPlantModalProps) {
    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState(initialPlantType || 'Mango');

    useEffect(() => {
        if (initialPlantType && isVisible) setPlantType(initialPlantType);
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

                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <View>
                            <Text style={styles.modalTitle}>Add New Plant</Text>
                            <Text style={{ fontSize: 13, color: '#94a3b8', fontWeight: '500', marginTop: 3 }}>
                                Give your plant a name & type
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose}>
                            <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                <Feather name="x" size={18} color="#64748b" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 }} />

                    {/* Plant Name */}
                    <Text style={styles.label}>Plant Name</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f8fafc',
                        borderRadius: 16,
                        borderWidth: 1.5,
                        borderColor: plantName ? '#10b981' : '#e2e8f0',
                        paddingHorizontal: 14,
                        marginBottom: 20,
                        gap: 10,
                    }}>
                        <Feather name="tag" size={16} color={plantName ? '#10b981' : '#94a3b8'} />
                        <TextInput
                            style={{
                                flex: 1,
                                height: 50,
                                fontSize: 15,
                                fontWeight: '600',
                                color: '#1e293b',
                            }}
                            placeholder="e.g. My Backyard Mango"
                            placeholderTextColor="#cbd5e1"
                            value={plantName}
                            onChangeText={setPlantName}
                        />
                    </View>

                    {/* Plant Type */}
                    <Text style={styles.label}>Plant Type</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                        {plantTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                activeOpacity={0.7}
                                onPress={() => setPlantType(type)}
                                style={[
                                    {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 16,
                                        borderWidth: 1.5,
                                    },
                                    plantType === type
                                        ? { backgroundColor: '#ecfdf5', borderColor: '#10b981' }
                                        : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
                                ]}
                            >
                                <Text style={{ fontSize: 18 }}>{getPlantEmoji(type)}</Text>
                                <Text style={[
                                    { fontSize: 14, fontWeight: '700' },
                                    plantType === type ? { color: '#059669' } : { color: '#64748b' },
                                ]}>
                                    {type}
                                </Text>
                                {plantType === type && (
                                    <View style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: '#10b981',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Feather name="check" size={10} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 }} />

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.btnSecondary, { flex: 1 }]}
                            onPress={handleClose}
                        >
                            <Text style={styles.btnSecondaryText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ flex: 1.5 }}
                            onPress={handleSave}
                        >
                            <LinearGradient
                                colors={['#059669', '#10b981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.btnPrimary]}
                            >
                                <Feather name="plus" size={18} color="#fff" />
                                <Text style={styles.btnPrimaryText}>Add Plant</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
