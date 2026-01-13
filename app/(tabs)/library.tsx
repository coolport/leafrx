import React from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { diseases } from '../../constants/mockData';

export default function LibraryScreen() {
    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Knowledge Library</Text>
                <Text style={styles.pageSubtitle}>Learn about diseases and care</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInput}>
                        <Feather name="search" size={20} color="#9ca3af" />
                        <TextInput
                            placeholder="Search diseases, treatments..."
                            style={styles.searchInputText}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>

                {diseases.map((disease, i) => (
                    <View key={i} style={styles.plantCard}>
                        <View style={[styles.plantIcon, { backgroundColor: disease.color }]}>
                            <Text style={{ fontSize: 24 }}>⚠️</Text>
                        </View>
                        <View style={styles.plantInfo}>
                            <Text style={styles.plantName}>{disease.name}</Text>
                            <Text style={styles.plantMeta}>Affects: {disease.affected}</Text>
                            <View style={{ marginTop: 8 }}>
                                <View style={[styles.severityBadge, { backgroundColor: disease.color }]}>
                                    <Text style={[styles.severityText, { color: disease.textColor }]}>{disease.severity} Severity</Text>
                                </View>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color="#9ca3af" />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
