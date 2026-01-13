import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';

export default function ScanScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Scan Leaf</Text>
                    <Text style={styles.pageSubtitle}>Take or upload a photo of the leaf</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.cameraArea}>
                        <Feather name="camera" size={64} color="#9ca3af" />
                        <Text style={styles.cameraText}>Position leaf in frame</Text>
                        <Text style={styles.cameraHint}>Make sure the leaf is well-lit and in focus</Text>
                    </View>

                    <TouchableOpacity style={styles.btnPrimary}>
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnPrimaryText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSecondary}>
                        <Text style={styles.btnSecondaryText}>Upload from Gallery</Text>
                    </TouchableOpacity>

                    <View style={styles.infoBox}>
                        <Feather name="info" size={20} color="#3b82f6" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoTitle}>Tips for best results:</Text>
                            <Text style={styles.infoText}>• Use natural lighting when possible</Text>
                            <Text style={styles.infoText}>• Keep camera steady and focused</Text>
                            <Text style={styles.infoText}>• Capture the entire leaf if possible</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
