import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { HealthOverview } from '../../components/leafrx/HealthOverview';
import { QuickActions } from '../../components/leafrx/QuickActions';
import { PlantCard } from '../../components/leafrx/PlantCard';
import { RecentScanItem } from '../../components/leafrx/RecentScanItem';
import { Link } from 'expo-router';
import { usePlantStore } from '../../store/usePlantStore';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { plants, scans } = usePlantStore();

  const { data: apiStatus } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => apiService.getHealth(),
    refetchInterval: 60000, // Check every minute
  });

  const isApiOnline = apiStatus?.status === 'ok';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Hello, Juan!</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerSubtitle}>Monitor your trees health</Text>
                <View style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: isApiOnline ? '#10b981' : '#ef4444',
                  marginLeft: 8,
                  marginRight: 4
                }} />
                <Text style={{ fontSize: 10, color: '#e5e7eb' }}>
                  {isApiOnline ? 'API Online' : 'API Offline'}
                </Text>
              </View>
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
            {plants.length > 0 && (
              <Link href="/(tabs)/tracking" asChild>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All →</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
          
          {plants.length > 0 ? (
            plants.slice(0, 3).map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))
          ) : (
            <View style={{ padding: 20, backgroundColor: '#f9fafb', borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280', marginBottom: 12 }}>No plants tracked yet.</Text>
              <Link href="/(tabs)/scan" asChild>
                <TouchableOpacity style={[styles.btnSecondary, { paddingVertical: 8 }]}>
                  <Text style={styles.btnSecondaryText}>Start First Scan</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>

        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {scans.length > 0 ? (
            scans.slice(0, 5).map(scan => (
              <RecentScanItem key={scan.id} scan={scan} />
            ))
          ) : (
            <View style={{ padding: 20, backgroundColor: '#f9fafb', borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>No scans performed yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
