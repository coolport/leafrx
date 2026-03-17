import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { createStyles } from '../../constants/styles';
import { useColors } from '../../hooks/use-colors';

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
    const colors = useColors();
    const styles = createStyles(colors);
    
    // Normalize plant type to match our list exactly
    const getNormalizedType = (type?: string) => {
        if (!type) return 'Mango';
        const found = plantTypes.find(t => t.toLowerCase() === type.toLowerCase());
        return found || 'Mango';
    };

    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState(getNormalizedType(initialPlantType));

    useEffect(() => {
        if (isVisible) {
            setPlantType(getNormalizedType(initialPlantType));
        }
        if (!isVisible) {
            setPlantName('');
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
                            <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: '500', marginTop: 3 }}>
                                Give your plant a name & type
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose}>
                            <View style={{ backgroundColor: colors.background, padding: 8, borderRadius: 20 }}>
                                <Feather name="x" size={18} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

                    {/* Plant Name */}
                    <Text style={styles.label}>Plant Name</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.background,
                        borderRadius: 16,
                        borderWidth: 1.5,
                        borderColor: plantName ? colors.primary : colors.border,
                        paddingHorizontal: 14,
                        marginBottom: 20,
                        gap: 10,
                    }}>
                        <Feather name="tag" size={16} color={plantName ? colors.primary : colors.textMuted} />
                        <TextInput
                            style={{
                                flex: 1,
                                height: 50,
                                fontSize: 15,
                                fontWeight: '600',
                                color: colors.text,
                            }}
                            placeholder="e.g. My Backyard Mango"
                            placeholderTextColor={colors.textMuted}
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
                                        ? { backgroundColor: `${colors.primary}1A`, borderColor: colors.primary }
                                        : { backgroundColor: colors.background, borderColor: colors.border },
                                ]}
                            >
                                <Text style={{ fontSize: 18 }}>{getPlantEmoji(type)}</Text>
                                <Text style={[
                                    { fontSize: 14, fontWeight: '700' },
                                    plantType === type ? { color: colors.primary } : { color: colors.textSecondary },
                                ]}>
                                    {type}
                                </Text>
                                {plantType === type && (
                                    <View style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: colors.primary,
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
                    <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 16 }} />

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
                                colors={[colors.primaryDark, colors.primary]}
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
