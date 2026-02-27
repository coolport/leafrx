import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Plant } from './types';

type AssignPlantModalProps = {
    isVisible: boolean;
    onClose: () => void;
    plants: Plant[];
    onSelectPlant: (plant: Plant) => void;
};

function getPlantEmoji(type: string) {
    const t = type.toLowerCase();
    if (t.includes('mango')) return '🥭';
    if (t.includes('banana')) return '🍌';
    if (t.includes('guava')) return '🍐';
    if (t.includes('calamansi')) return '🫒';
    return '🌿';
}

function getHealthColor(health: number) {
    if (health >= 75) return '#10b981';
    if (health >= 45) return '#f59e0b';
    return '#ef4444';
}

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

                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <View>
                            <Text style={styles.modalTitle}>Assign to Plant</Text>
                            <Text style={{ fontSize: 13, color: '#94a3b8', fontWeight: '500', marginTop: 3 }}>
                                Select a plant to link this scan
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <View style={{ backgroundColor: '#f1f5f9', padding: 8, borderRadius: 20 }}>
                                <Feather name="x" size={18} color="#64748b" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 }} />

                    {/* Plant list */}
                    <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                        {plants.length > 0 ? (
                            plants.map((plant, index) => (
                                <TouchableOpacity
                                    key={plant.id}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 14,
                                        paddingVertical: 12,
                                        paddingHorizontal: 14,
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 16,
                                        marginBottom: 8,
                                        borderWidth: 1,
                                        borderColor: '#f1f5f9',
                                    }}
                                    onPress={() => onSelectPlant(plant)}
                                >
                                    {/* Emoji icon */}
                                    <View style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 14,
                                        backgroundColor: '#ecfdf5',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: '#d1fae5',
                                    }}>
                                        <Text style={{ fontSize: 22 }}>{getPlantEmoji(plant.type)}</Text>
                                    </View>

                                    {/* Info */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2 }}>
                                            {plant.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '500' }}>
                                            {plant.type}
                                        </Text>
                                    </View>

                                    {/* Health score */}
                                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '800', color: getHealthColor(plant.health) }}>
                                            {Math.round(plant.health)}%
                                        </Text>
                                        <Feather name="chevron-right" size={16} color="#cbd5e1" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 32, gap: 10 }}>
                                <View style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 20,
                                    backgroundColor: '#f1f5f9',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Feather name="inbox" size={24} color="#94a3b8" />
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>No plants yet</Text>
                                <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 18 }}>
                                    Add a new plant first to assign this scan.
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 }} />

                    {/* Cancel button */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.btnSecondary, { width: '100%' }]}
                        onPress={onClose}
                    >
                        <Text style={styles.btnSecondaryText}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}
