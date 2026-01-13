import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { myPlants, recentScans } from '../../constants/mockData';
import { HealthOverview } from '../../components/leafrx/HealthOverview';
import { QuickActions } from '../../components/leafrx/QuickActions';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { RecentScanItem } from '../../components/leafrx/RecentScanItem';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Hello, Juan!</Text>
              <Text style={styles.headerSubtitle}>Monitor your trees health</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Feather name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <HealthOverview />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActions />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Plants</Text>
            <Link href="/(tabs)/tracking" asChild>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All →</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {myPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </View>

        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {recentScans.map(scan => (
            <RecentScanItem key={scan.id} scan={scan} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
